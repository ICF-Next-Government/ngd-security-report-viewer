import type { GitLabSastReport } from "@/types/gitlab-sast";
import type { ReportFormat, UnifiedReport } from "@/types/report";
import type { SarifLog } from "@/types/sarif";
import type { SemgrepOutput } from "@/types/semgrep";
import { GitLabSastParser } from "@/utils/gitLabSastParser";
import { SarifParser } from "@/utils/sarifParser";
import { SemgrepParser } from "@/utils/semgrepParser";

/**
 * Main parser class that handles multiple security report formats
 *
 * This class acts as a facade for different security report parsers,
 * automatically detecting the format and delegating to the appropriate parser.
 *
 * Supported formats:
 * - SARIF (Static Analysis Results Interchange Format)
 * - Semgrep JSON output
 * - GitLab SAST JSON report
 */
export class ReportParser {
  /**
   * Parses security report data and returns a unified report format
   * @param data - Raw JSON data from a security scanning tool
   * @returns UnifiedReport containing parsed results and metadata
   * @throws Error if the format is not recognized or parsing fails
   */
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
        // Old format with direct line/column fields
        ((firstResult.line !== undefined && firstResult.column !== undefined) ||
          // New format with start/end objects
          (firstResult.start &&
            firstResult.end &&
            firstResult.start.line !== undefined &&
            firstResult.start.col !== undefined)) &&
        (firstResult.severity || firstResult.extra?.severity)
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
      Array.isArray(data.errors) &&
      (data.paths || data.skipped_rules !== undefined)
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
