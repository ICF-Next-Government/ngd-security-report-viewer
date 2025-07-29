import { SEVERITY_LEVELS, TOOL_NAMES } from "@/constants";
import type { SeverityLevel } from "@/constants";
import { ProcessedResult, ReportSummary } from "@/types/report";
import { SemgrepMetadata, SemgrepOutput, SemgrepResult } from "@/types/semgrep";
import {
  mapSecuritySeverityScore,
  normalizeSeverity,
} from "@/utils/helpers/severity";

export class SemgrepParser {
  static parse(semgrepData: SemgrepOutput): {
    results: ProcessedResult[];
    summary: ReportSummary;
  } {
    // Detect if this is the new format (with start/end objects) or old format
    const isNewFormat = this.isNewSemgrepFormat(semgrepData);
    const results: ProcessedResult[] = [];
    let totalFindings = 0;
    let criticalCount = 0;
    let highCount = 0;
    let mediumCount = 0;
    let lowCount = 0;
    let infoCount = 0;
    const filesSet = new Set<string>();

    const toolName = TOOL_NAMES.SEMGREP;
    const toolVersion = semgrepData.version || undefined;

    semgrepData.results.forEach((result, index) => {
      const processed = this.processResult(result, index.toString());
      results.push(processed);
      totalFindings++;

      // Count by severity
      switch (processed.severity) {
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

      filesSet.add(processed.file);
    });

    const summary: ReportSummary = {
      totalFindings,
      criticalCount,
      highCount,
      mediumCount,
      lowCount,
      infoCount,
      severityCounts: {
        critical: criticalCount,
        high: highCount,
        medium: mediumCount,
        low: lowCount,
        info: infoCount,
      },
      filesAffected: filesSet.size,
      toolName: isNewFormat
        ? `${toolName} v${toolVersion} (new format)`
        : `${toolName} v${toolVersion} (legacy format)`,
      toolVersion,
      format: "semgrep",
    };

    return { results, summary };
  }

  private static processResult(
    result: SemgrepResult,
    id: string,
  ): ProcessedResult {
    // Extract position information based on format (old vs new)
    const positions = this.extractPositions(result);

    // Get metadata from either direct metadata field or extra.metadata
    const metadata = this.extractMetadata(result);

    // Get message from either direct message field or extra.message
    const message =
      result.message || result.extra?.message || "No message provided";

    // Get severity from multiple possible locations
    const severity = this.determineSeverity(result, metadata);
    const tags = this.extractTags(metadata);
    const description = this.buildDescription(result, metadata, message);

    return {
      id,
      ruleId: result.check_id,
      ruleName: result.check_id.split(".").pop() || result.check_id,
      message,
      severity,
      level: (
        result.severity ||
        result.extra?.severity ||
        "INFO"
      ).toLowerCase(),
      file: result.path,
      startLine: positions.startLine,
      endLine: positions.endLine,
      startColumn: positions.startColumn,
      endColumn: positions.endColumn,
      snippet: result.extra?.lines,
      description,
      tags,
      metadata: {
        ...metadata,
        ...result.extra,
        fingerprint: result.extra?.fingerprint,
        engine_kind: result.extra?.engine_kind,
        validation_state: result.extra?.validation_state,
        fix: result.extra?.fix,
      },
    };
  }

  private static extractPositions(result: SemgrepResult): {
    startLine: number;
    endLine: number;
    startColumn?: number;
    endColumn?: number;
  } {
    // New format with start/end objects
    if (result.start && result.end) {
      return {
        startLine: result.start.line,
        endLine: result.end.line,
        startColumn: result.start.col,
        endColumn: result.end.col,
      };
    }

    // Old format with direct line/column fields
    return {
      startLine: result.line || 0,
      endLine: result.end_line || result.line || 0,
      startColumn: result.column,
      endColumn: result.end_column,
    };
  }

  private static extractMetadata(result: SemgrepResult): SemgrepMetadata {
    // Metadata can be in multiple places depending on the format
    const directMetadata = result.metadata || {};
    const extraMetadata = result.extra?.metadata || {};

    // Merge metadata from both sources, with extra.metadata taking precedence
    return {
      ...directMetadata,
      ...extraMetadata,
    };
  }

  private static determineSeverity(
    result: SemgrepResult,
    metadata: SemgrepMetadata,
  ): SeverityLevel {
    // Check security-severity in metadata
    const securitySeverity = metadata?.["security-severity"];
    if (securitySeverity) {
      return mapSecuritySeverityScore(Number.parseFloat(securitySeverity));
    }

    // Check impact/likelihood combination
    const impact = metadata?.impact?.toUpperCase();
    const likelihood = metadata?.likelihood?.toUpperCase();

    if (impact && likelihood) {
      return this.mapImpactLikelihood(impact, likelihood);
    }

    // Check confidence level
    const confidence = metadata?.confidence?.toUpperCase();
    if (confidence) {
      return this.mapConfidence(confidence);
    }

    // Check severity in extra field
    if (result.extra?.severity) {
      return normalizeSeverity(result.extra.severity);
    }

    // Fallback to direct severity field
    if (result.severity) {
      return normalizeSeverity(result.severity);
    }

    // Default to INFO if no severity information found
    return SEVERITY_LEVELS.INFO;
  }

  private static mapImpactLikelihood(
    impact: string,
    likelihood: string,
  ): SeverityLevel {
    // Simple matrix mapping
    if (impact === "HIGH" && likelihood === "HIGH")
      return SEVERITY_LEVELS.CRITICAL;
    if (impact === "HIGH" || likelihood === "HIGH") return SEVERITY_LEVELS.HIGH;
    if (impact === "MEDIUM" || likelihood === "MEDIUM")
      return SEVERITY_LEVELS.MEDIUM;
    if (impact === "LOW" || likelihood === "LOW") return SEVERITY_LEVELS.LOW;
    return SEVERITY_LEVELS.INFO;
  }

  private static mapConfidence(confidence: string): SeverityLevel {
    switch (confidence) {
      case "HIGH":
        return SEVERITY_LEVELS.HIGH;
      case "MEDIUM":
        return SEVERITY_LEVELS.MEDIUM;
      case "LOW":
        return SEVERITY_LEVELS.LOW;
      default:
        return SEVERITY_LEVELS.INFO;
    }
  }

  private static extractTags(metadata: SemgrepMetadata): string[] {
    const tags: string[] = [];

    // Add category
    if (metadata.category) {
      tags.push(metadata.category);
    }

    // Add subcategories
    if (metadata.subcategory) {
      tags.push(...metadata.subcategory);
    }

    // Add technology
    if (metadata.technology) {
      tags.push(...metadata.technology);
    }

    // Add vulnerability class
    if (metadata.vulnerability_class) {
      tags.push(...metadata.vulnerability_class);
    }

    // Add CWE
    if (metadata.cwe) {
      if (Array.isArray(metadata.cwe)) {
        tags.push(...metadata.cwe);
      } else if (typeof metadata.cwe === "string") {
        tags.push(metadata.cwe);
      }
    }

    // Add OWASP
    if (metadata.owasp) {
      if (Array.isArray(metadata.owasp)) {
        tags.push(...metadata.owasp);
      } else if (typeof metadata.owasp === "string") {
        tags.push(metadata.owasp);
      }
    }

    // Add CWE top 25 tags
    if (metadata.cwe2021_top25 || metadata["cwe2021-top25"]) {
      tags.push("cwe2021-top25");
    }
    if (metadata.cwe2022_top25 || metadata["cwe2022-top25"]) {
      tags.push("cwe2022-top25");
    }

    // Add confidence level if present
    if (metadata.confidence) {
      tags.push(`confidence:${metadata.confidence.toLowerCase()}`);
    }

    // Add bandit code if present
    if (metadata["bandit-code"]) {
      tags.push(`bandit:${metadata["bandit-code"]}`);
    }

    return [...new Set(tags)]; // Remove duplicates
  }

  private static buildDescription(
    result: SemgrepResult,
    metadata: SemgrepMetadata,
    message: string,
  ): string {
    const parts: string[] = [];

    // Add main message
    parts.push(message);

    // Add metadata description if different from message
    if (metadata.description && metadata.description !== message) {
      parts.push(`\n${metadata.description}`);
    }

    // Add fix suggestion if available
    if (result.extra?.fix) {
      parts.push("\n\nSuggested fix:");
      parts.push(`\`\`\`\n${result.extra.fix}\n\`\`\``);
    }

    // Add ASVS information if available
    if (metadata.asvs) {
      parts.push("\n\nASVS Reference:");
      if (metadata.asvs.control_id) {
        parts.push(`- Control: ${metadata.asvs.control_id}`);
      }
      if (metadata.asvs.section) {
        parts.push(`- Section: ${metadata.asvs.section}`);
      }
      if (metadata.asvs.control_url) {
        parts.push(`- URL: ${metadata.asvs.control_url}`);
      }
    }

    // Add references
    if (metadata.references && metadata.references.length > 0) {
      parts.push("\n\nReferences:");
      metadata.references.forEach((ref: string) => {
        parts.push(`- ${ref}`);
      });
    }

    // Add source rule URL
    if (metadata.source_rule_url || metadata["source-rule-url"]) {
      parts.push(
        `\n\nRule source: ${metadata.source_rule_url || metadata["source-rule-url"]}`,
      );
    }

    // Add semgrep.dev rule information
    if (metadata["semgrep.dev"]?.rule?.url) {
      parts.push(`\n\nSemgrep rule: ${metadata["semgrep.dev"].rule.url}`);
    }

    // Add shortlink if available
    if (metadata.shortlink) {
      parts.push(`\n\nShort link: ${metadata.shortlink}`);
    }

    return parts.join("\n");
  }

  private static isNewSemgrepFormat(data: SemgrepOutput): boolean {
    // Check if any result uses the new format with start/end position objects
    if (data.results && data.results.length > 0) {
      return data.results.some(
        (result) =>
          result.start !== undefined &&
          result.end !== undefined &&
          result.start.line !== undefined &&
          result.start.col !== undefined,
      );
    }

    // For empty results, check if skipped_rules field exists (new format indicator)
    // or if version is 1.107.0 or higher
    if (data.skipped_rules !== undefined) {
      return true;
    }

    // Parse version to determine format
    if (data.version) {
      const versionParts = data.version
        .split(".")
        .map((part) => Number.parseInt(part, 10));
      if (versionParts.length >= 3) {
        const [major, minor, patch] = versionParts;
        // Version 1.107.0 and above use the new format
        if (major > 1 || (major === 1 && minor >= 107)) {
          return true;
        }
      }
    }

    return false;
  }
}
