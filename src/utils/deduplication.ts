import { ProcessedResult } from "../types/report";

export interface DuplicateGroup {
  id: string;
  representativeResult: ProcessedResult;
  duplicates: ProcessedResult[];
  occurrences: number;
  affectedFiles: string[];
  lineRanges: Array<{ file: string; startLine?: number; endLine?: number }>;
}

export interface DeduplicationOptions {
  groupByRuleId: boolean;
  groupBySimilarMessage: boolean;
  similarityThreshold: number;
}

const DEFAULT_OPTIONS: DeduplicationOptions = {
  groupByRuleId: true,
  groupBySimilarMessage: true,
  similarityThreshold: 0.85,
};

export class DeduplicationService {
  /**
   * Groups similar findings together to reduce duplicate noise
   */
  static deduplicateFindings(
    results: ProcessedResult[],
    options: Partial<DeduplicationOptions> = {},
  ): DuplicateGroup[] {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const groups = new Map<string, DuplicateGroup>();

    results.forEach((result) => {
      const groupKey = this.getGroupKey(result, opts);
      let existingGroup = groups.get(groupKey);

      if (!existingGroup) {
        // Check for similar messages if enabled
        if (opts.groupBySimilarMessage) {
          existingGroup = this.findSimilarGroup(result, groups, opts.similarityThreshold);
        }
      }

      if (existingGroup) {
        // Add to existing group
        existingGroup.duplicates.push(result);
        existingGroup.occurrences++;

        if (!existingGroup.affectedFiles.includes(result.file)) {
          existingGroup.affectedFiles.push(result.file);
        }

        existingGroup.lineRanges.push({
          file: result.file,
          startLine: result.startLine,
          endLine: result.endLine,
        });
      } else {
        // Create new group
        const groupId = this.generateGroupId();
        const newGroup: DuplicateGroup = {
          id: groupId,
          representativeResult: result,
          duplicates: [],
          occurrences: 1,
          affectedFiles: [result.file],
          lineRanges: [
            {
              file: result.file,
              startLine: result.startLine,
              endLine: result.endLine,
            },
          ],
        };
        groups.set(groupKey, newGroup);
      }
    });

    return Array.from(groups.values()).sort((a, b) => {
      // Sort by severity first, then by occurrences
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
      const severityCompare =
        severityOrder[a.representativeResult.severity as keyof typeof severityOrder] -
        severityOrder[b.representativeResult.severity as keyof typeof severityOrder];

      if (severityCompare !== 0) return severityCompare;

      return b.occurrences - a.occurrences;
    });
  }

  /**
   * Generate a unique key for grouping similar findings
   */
  private static getGroupKey(result: ProcessedResult, options: DeduplicationOptions): string {
    const parts: string[] = [];

    if (options.groupByRuleId) {
      parts.push(result.ruleId);
      parts.push(result.severity);
    }

    // Add a normalized version of the message for basic grouping
    if (!options.groupBySimilarMessage) {
      // If not using similarity matching, include normalized message in key
      const normalizedMessage = this.normalizeMessage(result.message);
      parts.push(normalizedMessage);
    }

    return parts.join(":");
  }

  /**
   * Find a group with a similar message using fuzzy matching
   */
  private static findSimilarGroup(
    result: ProcessedResult,
    groups: Map<string, DuplicateGroup>,
    threshold: number,
  ): DuplicateGroup | undefined {
    for (const group of groups.values()) {
      // Only compare within the same rule ID and severity
      if (
        group.representativeResult.ruleId === result.ruleId &&
        group.representativeResult.severity === result.severity
      ) {
        const similarity = this.calculateSimilarity(
          result.message,
          group.representativeResult.message,
        );

        if (similarity >= threshold) {
          return group;
        }
      }
    }
    return undefined;
  }

  /**
   * Calculate similarity between two messages (0-1)
   */
  private static calculateSimilarity(message1: string, message2: string): number {
    const normalized1 = this.normalizeMessage(message1);
    const normalized2 = this.normalizeMessage(message2);

    // If normalized messages are identical, they're duplicates
    if (normalized1 === normalized2) return 1;

    // Use Jaccard similarity for token-based comparison
    const tokens1 = this.tokenize(normalized1);
    const tokens2 = this.tokenize(normalized2);

    const intersection = tokens1.filter((token) => tokens2.includes(token));
    const union = [...new Set([...tokens1, ...tokens2])];

    return union.length > 0 ? intersection.length / union.length : 0;
  }

  /**
   * Normalize a message by removing variable parts
   */
  private static normalizeMessage(message: string): string {
    return (
      message
        .toLowerCase()
        // Remove file paths
        .replace(/[\/\\][\w\-\.\/\\]+\.\w+/g, "FILE_PATH")
        // Remove line numbers
        .replace(/line\s*\d+/gi, "LINE_NUMBER")
        .replace(/:\d+:\d+/g, ":LINE:COL")
        // Remove quoted strings
        .replace(/"[^"]*"/g, "QUOTED_STRING")
        .replace(/'[^']*'/g, "QUOTED_STRING")
        // Remove numbers
        .replace(/\b\d+\b/g, "NUMBER")
        // Remove extra whitespace
        .replace(/\s+/g, " ")
        .trim()
    );
  }

  /**
   * Tokenize a message into words
   */
  private static tokenize(message: string): string[] {
    return message.split(/\s+/).filter((token) => token.length > 2); // Ignore very short tokens
  }

  /**
   * Generate a unique group ID
   */
  private static generateGroupId(): string {
    return `group-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get a summary message for a duplicate group
   */
  static getGroupSummary(group: DuplicateGroup): string {
    const fileCount = group.affectedFiles.length;
    const occurrenceCount = group.occurrences;

    if (fileCount === 1) {
      return `Found ${occurrenceCount} time${occurrenceCount > 1 ? "s" : ""} in ${group.affectedFiles[0]}`;
    } else {
      return `Found ${occurrenceCount} times across ${fileCount} files`;
    }
  }

  /**
   * Get detailed location information for a duplicate group
   */
  static getGroupLocations(group: DuplicateGroup): string[] {
    const locationMap = new Map<string, number[]>();

    group.lineRanges.forEach((range) => {
      if (!locationMap.has(range.file)) {
        locationMap.set(range.file, []);
      }
      if (range.startLine) {
        locationMap.get(range.file)!.push(range.startLine);
      }
    });

    return Array.from(locationMap.entries()).map(([file, lines]) => {
      const sortedLines = [...new Set(lines)].sort((a, b) => a - b);
      if (sortedLines.length === 0) {
        return file;
      } else if (sortedLines.length === 1) {
        return `${file}:${sortedLines[0]}`;
      } else {
        return `${file}: lines ${sortedLines.join(", ")}`;
      }
    });
  }
}
