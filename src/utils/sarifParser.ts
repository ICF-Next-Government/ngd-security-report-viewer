import { SarifLog, SarifResult } from "../types/sarif";
import { ProcessedResult, ReportSummary } from "../types/report";
import { BaseParser } from "./baseParser";
import {
  normalizeSeverity,
  mapSecuritySeverityScore,
} from "./helpers/severity";

export class SarifParser extends BaseParser {
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
        const processed = this.processResult(
          result,
          run,
          `${runIndex}-${resultIndex}`,
        );
        results.push(processed);
      });
    });

    const summary = this.createSummary(results, toolName, toolVersion, "sarif");
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

  private static determineSeverity(result: SarifResult, rule: any) {
    // Check security-severity in result properties
    const resultSeverity = result.properties?.["security-severity"];
    if (resultSeverity) {
      return mapSecuritySeverityScore(parseFloat(resultSeverity));
    }

    // Check security-severity in rule properties
    const ruleSeverity = rule?.properties?.["security-severity"];
    if (ruleSeverity) {
      return mapSecuritySeverityScore(parseFloat(ruleSeverity));
    }

    // Fallback to level mapping
    return normalizeSeverity(result.level || "info");
  }
}
