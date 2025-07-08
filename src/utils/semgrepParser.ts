import {
  SemgrepOutput,
  SemgrepResult,
  SemgrepMetadata,
} from "../types/semgrep";
import { ProcessedResult, ReportSummary } from "../types/report";
import { SEVERITY_LEVELS, TOOL_NAMES } from "../constants";
import {
  mapSecuritySeverityScore,
  normalizeSeverity,
} from "./helpers/severity";
import type { SeverityLevel } from "../constants";

export class SemgrepParser {
  static parse(semgrepData: SemgrepOutput): {
    results: ProcessedResult[];
    summary: ReportSummary;
  } {
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
      filesAffected: filesSet.size,
      toolName,
      toolVersion,
      format: "semgrep",
    };

    return { results, summary };
  }

  private static processResult(
    result: SemgrepResult,
    id: string,
  ): ProcessedResult {
    const severity = this.determineSeverity(result);
    const tags = this.extractTags(result.metadata);
    const description = this.buildDescription(result);

    return {
      id,
      ruleId: result.check_id,
      ruleName: result.check_id.split(".").pop() || result.check_id,
      message: result.message,
      severity,
      level: result.severity.toLowerCase(),
      file: result.path,
      startLine: result.line,
      endLine: result.end_line,
      startColumn: result.column,
      endColumn: result.end_column,
      snippet: result.extra.lines,
      description,
      tags,
      metadata: {
        ...result.metadata,
        ...result.extra,
      },
    };
  }

  private static determineSeverity(result: SemgrepResult): SeverityLevel {
    // Check security-severity in metadata
    const securitySeverity = result.metadata?.["security-severity"];
    if (securitySeverity) {
      return mapSecuritySeverityScore(parseFloat(securitySeverity));
    }

    // Check impact/likelihood combination
    const impact = result.metadata?.impact?.toUpperCase();
    const likelihood = result.metadata?.likelihood?.toUpperCase();

    if (impact && likelihood) {
      return this.mapImpactLikelihood(impact, likelihood);
    }

    // Check confidence level
    const confidence = result.metadata?.confidence?.toUpperCase();
    if (confidence) {
      return this.mapConfidence(confidence);
    }

    // Fallback to severity field
    return normalizeSeverity(result.severity);
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
      tags.push(...metadata.cwe);
    }

    // Add OWASP
    if (metadata.owasp) {
      tags.push(...metadata.owasp);
    }

    // Add confidence level if present
    if (metadata.confidence) {
      tags.push(`confidence:${metadata.confidence.toLowerCase()}`);
    }

    return [...new Set(tags)]; // Remove duplicates
  }

  private static buildDescription(result: SemgrepResult): string {
    const parts: string[] = [];

    // Add main message
    if (result.message) {
      parts.push(result.message);
    }

    // Add metadata description if different from message
    if (result.extra.message && result.extra.message !== result.message) {
      parts.push(result.extra.message);
    }

    // Add references
    if (result.metadata.references && result.metadata.references.length > 0) {
      parts.push("\n\nReferences:");
      result.metadata.references.forEach((ref: string) => {
        parts.push(`- ${ref}`);
      });
    }

    // Add source rule URL
    if (result.metadata.source_rule_url) {
      parts.push(`\n\nRule source: ${result.metadata.source_rule_url}`);
    }

    return parts.join("\n");
  }
}
