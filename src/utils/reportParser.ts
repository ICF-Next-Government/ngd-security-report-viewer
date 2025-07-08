import { SarifParser } from "./sarifParser";
import { SemgrepParser } from "./semgrepParser";
import { GitLabSastParser } from "./gitlabSastParser";
import { SarifLog } from "../types/sarif";
import { SemgrepOutput } from "../types/semgrep";
import { GitLabSastReport } from "../types/gitlab-sast";
import { UnifiedReport, ReportFormat } from "../types/report";

export class ReportParser {
  static parse(data: any): UnifiedReport {
    const format = this.detectFormat(data);

    if (format === "sarif") {
      const parsed = SarifParser.parse(data as SarifLog);
      return {
        format: "sarif",
        results: parsed.results,
        summary: {
          ...parsed.summary,
          format: "sarif",
        },
        rawData: data,
      };
    } else if (format === "semgrep") {
      const parsed = SemgrepParser.parse(data as SemgrepOutput);
      return {
        format: "semgrep",
        results: parsed.results,
        summary: {
          ...parsed.summary,
          format: "semgrep",
        },
        rawData: data,
      };
    } else if (format === "gitlab-sast") {
      const parsed = GitLabSastParser.parse(data as GitLabSastReport);
      return {
        format: "gitlab-sast",
        results: parsed.results,
        summary: {
          ...parsed.summary,
          format: "gitlab-sast",
        },
        rawData: data,
      };
    } else {
      throw new Error(
        "Unsupported format. Please provide a valid SARIF, Semgrep, or GitLab SAST JSON file.",
      );
    }
  }

  private static detectFormat(data: any): ReportFormat | null {
    // Check for SARIF format
    if (
      data.version &&
      typeof data.version === "string" &&
      data.runs &&
      Array.isArray(data.runs)
    ) {
      // Additional SARIF validation
      const hasValidRuns = data.runs.every(
        (run: any) =>
          run.tool &&
          run.tool.driver &&
          run.results &&
          Array.isArray(run.results),
      );
      if (hasValidRuns) {
        return "sarif";
      }
    }

    // Check for Semgrep format
    if (
      data.results &&
      Array.isArray(data.results) &&
      data.results.length > 0
    ) {
      // Check if results have Semgrep-specific fields
      const firstResult = data.results[0];
      if (
        firstResult.check_id &&
        firstResult.path &&
        firstResult.line !== undefined &&
        firstResult.column !== undefined &&
        firstResult.severity
      ) {
        return "semgrep";
      }
    }

    // Also check for empty Semgrep results
    if (
      data.results &&
      Array.isArray(data.results) &&
      data.results.length === 0 &&
      data.errors !== undefined &&
      Array.isArray(data.errors)
    ) {
      return "semgrep";
    }

    // Check for GitLab SAST format
    if (
      data.vulnerabilities &&
      Array.isArray(data.vulnerabilities) &&
      data.version &&
      typeof data.version === "string"
    ) {
      // Check if vulnerabilities have GitLab-specific fields
      if (data.vulnerabilities.length > 0) {
        const firstVuln = data.vulnerabilities[0];
        if (
          firstVuln.id &&
          firstVuln.category &&
          firstVuln.scanner &&
          firstVuln.location &&
          firstVuln.identifiers &&
          Array.isArray(firstVuln.identifiers)
        ) {
          return "gitlab-sast";
        }
      } else if (data.scan) {
        // Empty vulnerabilities but has scan info is still valid GitLab SAST
        return "gitlab-sast";
      }
    }

    return null;
  }

  static getFormatDisplayName(format: ReportFormat): string {
    switch (format) {
      case "sarif":
        return "SARIF";
      case "semgrep":
        return "Semgrep";
      case "gitlab-sast":
        return "GitLab SAST";
      default:
        return "Unknown";
    }
  }

  static validateFile(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check file extension
      const validExtensions = [".json", ".sarif"];
      const fileName = file.name.toLowerCase();
      const hasValidExtension = validExtensions.some((ext) =>
        fileName.endsWith(ext),
      );

      if (!hasValidExtension) {
        reject(new Error("Please upload a JSON or SARIF file"));
        return;
      }

      // Check file size (max 50MB)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        reject(new Error("File size exceeds 50MB limit"));
        return;
      }

      resolve();
    });
  }
}
