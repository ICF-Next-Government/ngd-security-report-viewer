import { SEVERITY_LEVELS } from "../constants";
import { ProcessedResult, ReportSummary } from "../types/report";

/**
 * Base class for security report parsers
 *
 * This abstract class provides common functionality for parsing different security
 * report formats (SARIF, Semgrep, GitLab SAST, etc.). It includes utilities for:
 * - Counting findings by severity level
 * - Normalizing severity values across different formats
 * - Providing a consistent interface for parser implementations
 *
 * Subclasses must implement the static parse() method to handle specific formats.
 */
export abstract class BaseParser {
  /**
   * Count findings by severity level
   * @param results - Array of processed results
   * @returns Object with counts for each severity level
   */
  protected static countBySeverity(results: ProcessedResult[]): {
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
    infoCount: number;
  } {
    let criticalCount = 0;
    let highCount = 0;
    let mediumCount = 0;
    let lowCount = 0;
    let infoCount = 0;

    results.forEach((result) => {
      switch (result.severity) {
        case SEVERITY_LEVELS.CRITICAL:
          criticalCount++;
          break;
        case SEVERITY_LEVELS.HIGH:
          highCount++;
          break;
        case SEVERITY_LEVELS.MEDIUM:
          mediumCount++;
          break;
        case SEVERITY_LEVELS.LOW:
          lowCount++;
          break;
        case SEVERITY_LEVELS.INFO:
          infoCount++;
          break;
      }
    });

    return {
      criticalCount,
      highCount,
      mediumCount,
      lowCount,
      infoCount,
    };
  }

  /**
   * Extract unique files from results
   * @param results - Array of processed results
   * @returns Set of unique file paths
   */
  protected static extractUniqueFiles(results: ProcessedResult[]): Set<string> {
    const filesSet = new Set<string>();
    results.forEach((result) => {
      filesSet.add(result.file);
    });
    return filesSet;
  }

  /**
   * Create a report summary from processed results
   * @param results - Array of processed results
   * @param toolName - Name of the tool that generated the report
   * @param toolVersion - Version of the tool
   * @param format - Report format identifier
   * @returns Report summary object
   */
  protected static createSummary(
    results: ProcessedResult[],
    toolName: string,
    toolVersion: string | undefined,
    format: "sarif" | "semgrep" | "gitlab-sast",
  ): ReportSummary {
    const counts = this.countBySeverity(results);
    const filesSet = this.extractUniqueFiles(results);

    return {
      totalFindings: results.length,
      ...counts,
      severityCounts: {
        critical: counts.criticalCount,
        high: counts.highCount,
        medium: counts.mediumCount,
        low: counts.lowCount,
        info: counts.infoCount,
      },
      filesAffected: filesSet.size,
      toolName,
      toolVersion,
      format,
    };
  }

  /**
   * Safely extract a string value from an object path
   * @param obj - Object to extract from
   * @param path - Dot-separated path (e.g., "location.file")
   * @param defaultValue - Default value if path doesn't exist
   * @returns Extracted string or default value
   */
  protected static safeExtractString(
    obj: any,
    path: string,
    defaultValue = "",
  ): string {
    const keys = path.split(".");
    let current = obj;

    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        return defaultValue;
      }
    }

    return typeof current === "string" ? current : defaultValue;
  }

  /**
   * Safely extract a number value from an object path
   * @param obj - Object to extract from
   * @param path - Dot-separated path
   * @param defaultValue - Default value if path doesn't exist
   * @returns Extracted number or default value
   */
  protected static safeExtractNumber(
    obj: any,
    path: string,
    defaultValue?: number,
  ): number | undefined {
    const keys = path.split(".");
    let current = obj;

    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        return defaultValue;
      }
    }

    return typeof current === "number" ? current : defaultValue;
  }

  /**
   * Extract tags from various sources and deduplicate
   * @param sources - Array of tag sources (arrays or strings)
   * @returns Deduplicated array of tags
   */
  protected static extractTags(
    ...sources: (string[] | string | undefined)[]
  ): string[] {
    const tags: string[] = [];

    for (const source of sources) {
      if (Array.isArray(source)) {
        tags.push(...source);
      } else if (typeof source === "string") {
        tags.push(source);
      }
    }

    return [...new Set(tags)];
  }

  /**
   * Build a multiline description from parts
   * @param parts - Array of description parts
   * @returns Formatted description string
   */
  protected static buildDescription(parts: (string | undefined)[]): string {
    return parts.filter(Boolean).join("\n\n");
  }

  /**
   * Abstract method to be implemented by specific parsers
   * @param data - Raw report data
   * @returns Parsed results and summary
   */
  abstract parse(data: any): {
    results: ProcessedResult[];
    summary: ReportSummary;
  };
}
