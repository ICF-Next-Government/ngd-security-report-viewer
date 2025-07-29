import {
  GitLabSastIdentifier,
  GitLabSastReport,
  GitLabSastVulnerability,
} from "@/types/gitlab-sast";
import { ProcessedResult, ReportSummary } from "@/types/report";

export class GitLabSastParser {
  static parse(gitlabData: GitLabSastReport): {
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

    // Extract tool information from scan or default
    let toolName = "GitLab SAST";
    let toolVersion = gitlabData.version;

    if (gitlabData.scan?.scanner) {
      toolName = `${gitlabData.scan.scanner.name} (GitLab)`;
      if (gitlabData.scan.scanner.version) {
        toolVersion = gitlabData.scan.scanner.version;
      }
    }

    gitlabData.vulnerabilities.forEach((vuln, index) => {
      const processed = this.processVulnerability(vuln, index.toString());
      results.push(processed);
      totalFindings++;

      // Count by severity
      switch (processed.severity) {
        case "critical":
          criticalCount++;
          break;
        case "high":
          highCount++;
          break;
        case "medium":
          mediumCount++;
          break;
        case "low":
          lowCount++;
          break;
        case "info":
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
      toolName,
      toolVersion,
      format: "gitlab-sast",
    };

    return { results, summary };
  }

  private static processVulnerability(vuln: GitLabSastVulnerability, id: string): ProcessedResult {
    const severity = this.normalizeSeverity(vuln.severity);
    const tags = this.extractTags(vuln);
    const description = this.buildDescription(vuln);
    const ruleId = this.extractRuleId(vuln);

    return {
      id,
      ruleId,
      ruleName: vuln.name,
      message: vuln.message || vuln.name,
      severity,
      level: vuln.severity.toLowerCase(),
      file: vuln.location.file,
      startLine: vuln.location.start_line,
      endLine: vuln.location.end_line,
      startColumn: vuln.location.start_column,
      endColumn: vuln.location.end_column,
      snippet: vuln.raw_source_code_extract,
      description,
      tags,
      metadata: {
        confidence: vuln.confidence,
        scanner: vuln.scanner,
        identifiers: vuln.identifiers,
        links: vuln.links,
        evidence: vuln.evidence,
        flags: vuln.flags,
      },
    };
  }

  private static normalizeSeverity(
    severity: string,
  ): "critical" | "high" | "medium" | "low" | "info" {
    switch (severity.toLowerCase()) {
      case "critical":
        return "critical";
      case "high":
        return "high";
      case "medium":
        return "medium";
      case "low":
        return "low";
      case "info":
      case "unknown":
      default:
        return "info";
    }
  }

  private static extractRuleId(vuln: GitLabSastVulnerability): string {
    // Try to extract from cve field (often contains rule ID)
    if (vuln.cve) {
      // Extract semgrep_id if present
      const semgrepMatch = vuln.cve.match(/semgrep_id:([^:]+)/);
      if (semgrepMatch) {
        return semgrepMatch[1];
      }
      return vuln.cve;
    }

    // Try to find a semgrep_id identifier
    const semgrepId = vuln.identifiers.find((id) => id.type === "semgrep_id");
    if (semgrepId) {
      return semgrepId.value;
    }

    // Try to find any rule-like identifier
    const ruleId = vuln.identifiers.find(
      (id) => id.type.includes("rule") || id.type.includes("check") || id.type.includes("id"),
    );
    if (ruleId) {
      return ruleId.value;
    }

    // Fallback to the vulnerability ID
    return vuln.id;
  }

  private static extractTags(vuln: GitLabSastVulnerability): string[] {
    const tags: string[] = [];

    // Add category
    tags.push(vuln.category);

    // Add scanner
    tags.push(`scanner:${vuln.scanner.id}`);

    // Add confidence if present
    if (vuln.confidence && vuln.confidence !== "Unknown") {
      tags.push(`confidence:${vuln.confidence.toLowerCase()}`);
    }

    // Extract tags from identifiers
    vuln.identifiers.forEach((identifier) => {
      switch (identifier.type) {
        case "cwe":
          tags.push(`CWE-${identifier.value}`);
          break;
        case "owasp":
          tags.push(identifier.value);
          break;
        case "bandit_test_id":
        case "eslint_rule_id":
        case "flawfinder_func_name":
        case "gosec_rule_id":
        case "phpcs_security_audit_source":
          tags.push(identifier.name);
          break;
      }
    });

    // Add flags if present
    if (vuln.flags) {
      vuln.flags.forEach((flag) => {
        tags.push(`flag:${flag.type}`);
      });
    }

    return [...new Set(tags)]; // Remove duplicates
  }

  private static buildDescription(vuln: GitLabSastVulnerability): string {
    const parts: string[] = [];

    // Add main description
    parts.push(vuln.description);

    // Add solution if present
    if (vuln.solution) {
      parts.push("\n\nSolution:");
      parts.push(vuln.solution);
    }

    // Add evidence summary if present
    if (vuln.evidence?.summary) {
      parts.push("\n\nEvidence:");
      parts.push(vuln.evidence.summary);
    }

    // Add links if present
    if (vuln.links && vuln.links.length > 0) {
      parts.push("\n\nReferences:");
      vuln.links.forEach((link) => {
        if (link.name) {
          parts.push(`- [${link.name}](${link.url})`);
        } else {
          parts.push(`- ${link.url}`);
        }
      });
    }

    // Add identifier URLs
    const identifiersWithUrls = vuln.identifiers.filter((id) => id.url);
    if (identifiersWithUrls.length > 0) {
      if (vuln.links?.length === 0) {
        parts.push("\n\nReferences:");
      }
      identifiersWithUrls.forEach((id) => {
        parts.push(`- [${id.name}](${id.url})`);
      });
    }

    return parts.join("\n");
  }
}
