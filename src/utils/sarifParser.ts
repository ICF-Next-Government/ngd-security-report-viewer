import {
  SarifLog,
  SarifResult,
  ProcessedResult,
  ReportSummary,
} from "../types/sarif";

export class SarifParser {
  static parse(sarifData: SarifLog): {
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

    let toolName = "Unknown Tool";
    let toolVersion: string | undefined;

    sarifData.runs.forEach((run, runIndex) => {
      toolName = run.tool.driver.name;
      toolVersion = run.tool.driver.version;

      run.results.forEach((result, resultIndex) => {
        const processed = this.processResult(
          result,
          run,
          `${runIndex}-${resultIndex}`,
        );
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
    };

    return { results, summary };
  }

  private static processResult(
    result: SarifResult,
    run: any,
    id: string,
  ): ProcessedResult {
    const ruleId = result.ruleId || "unknown-rule";
    const rule = this.findRule(ruleId, run);

    const severity = this.determineSeverity(result, rule);
    const file =
      result.locations?.[0]?.physicalLocation?.artifactLocation.uri ||
      "unknown-file";
    const startLine =
      result.locations?.[0]?.physicalLocation?.region?.startLine;
    const endLine = result.locations?.[0]?.physicalLocation?.region?.endLine;
    const snippet =
      result.locations?.[0]?.physicalLocation?.region?.snippet?.text;
    const tags = rule?.properties?.tags || [];

    return {
      id,
      ruleId,
      ruleName: rule?.name || rule?.shortDescription?.text || ruleId,
      message: result.message.text,
      severity,
      level: result.level || "info",
      file,
      startLine,
      endLine,
      snippet,
      description: rule?.fullDescription?.text || rule?.help?.text,
      tags,
    };
  }

  private static findRule(ruleId: string, run: any) {
    // Check run.rules first
    if (run.rules) {
      const rule = run.rules.find((r: any) => r.id === ruleId);
      if (rule) return rule;
    }

    // Check tool.driver.rules
    if (run.tool.driver.rules) {
      const rule = run.tool.driver.rules.find((r: any) => r.id === ruleId);
      if (rule) return rule;
    }

    return null;
  }

  private static determineSeverity(
    result: SarifResult,
    rule: any,
  ): "critical" | "high" | "medium" | "low" | "info" {
    // Check security-severity in result properties
    const resultSeverity = result.properties?.["security-severity"];
    if (resultSeverity) {
      return this.mapSecuritySeverity(parseFloat(resultSeverity));
    }

    // Check security-severity in rule properties
    const ruleSeverity = rule?.properties?.["security-severity"];
    if (ruleSeverity) {
      return this.mapSecuritySeverity(parseFloat(ruleSeverity));
    }

    // Fallback to level mapping
    switch (result.level) {
      case "error":
        return "high";
      case "warning":
        return "medium";
      case "info":
      case "note":
      default:
        return "low";
    }
  }

  private static mapSecuritySeverity(
    score: number,
  ): "critical" | "high" | "medium" | "low" | "info" {
    if (score >= 9.0) return "critical";
    if (score >= 7.0) return "high";
    if (score >= 4.0) return "medium";
    if (score >= 1.0) return "low";
    return "info";
  }
}
