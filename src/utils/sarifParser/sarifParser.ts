import { ProcessedResult, ReportSummary } from "@/types/report";
import { SarifLog, SarifResult } from "@/types/sarif";
import { BaseParser } from "@/utils/baseParser";
import { mapSecuritySeverityScore, normalizeSeverity } from "@/utils/helpers/severity";

export class SarifParser {
  static parse(sarifData: SarifLog): {
    results: ProcessedResult[];
    summary: ReportSummary;
  } {
    const results: ProcessedResult[] = [];
    let toolName = "Unknown Tool";
    let toolVersion: string | undefined;

    sarifData.runs.forEach((run, runIndex) => {
      toolName = run.tool.driver.name;
      toolVersion = run.tool.driver.version;

      run.results.forEach((result, resultIndex) => {
        const processed = this.processResult(result, run, `${runIndex}-${resultIndex}`);
        results.push(processed);
      });
    });

    const summary = BaseParser.createSummary(results, toolName, toolVersion, "sarif");
    return { results, summary };
  }

  private static processResult(result: SarifResult, run: any, id: string): ProcessedResult {
    const ruleId = result.ruleId || "unknown-rule";
    const rule = SarifParser.findRule(ruleId, run);

    const severity = SarifParser.determineSeverity(result, rule);
    const file = result.locations?.[0]?.physicalLocation?.artifactLocation.uri || "unknown-file";
    const startLine = result.locations?.[0]?.physicalLocation?.region?.startLine;
    const endLine = result.locations?.[0]?.physicalLocation?.region?.endLine;
    const snippet = result.locations?.[0]?.physicalLocation?.region?.snippet?.text;
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

  private static determineSeverity(result: SarifResult, rule: any) {
    // Check security-severity in result properties
    const resultSeverity = result.properties?.["security-severity"];
    if (resultSeverity) {
      return mapSecuritySeverityScore(Number.parseFloat(resultSeverity));
    }

    // Check security-severity in rule properties
    const ruleSeverity = rule?.properties?.["security-severity"];
    if (ruleSeverity) {
      return mapSecuritySeverityScore(Number.parseFloat(ruleSeverity));
    }

    // Fallback to level mapping
    return normalizeSeverity(result.level || "info");
  }
}
