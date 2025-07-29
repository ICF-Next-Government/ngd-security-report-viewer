import { describe, it, expect } from "vitest";
import { ReportParser } from "../reportParser";
import type { SemgrepOutput } from "../../types/semgrep";
import type { SarifLog } from "../../types/sarif";
import type { GitLabSastReport } from "../../types/gitlab-sast";

describe("ReportParser", () => {
  describe("format detection", () => {
    it("should detect new Semgrep format with start/end position objects", () => {
      const newSemgrepData: SemgrepOutput = {
        version: "1.107.0",
        results: [
          {
            check_id: "test.rule",
            path: "test.py",
            start: { line: 1, col: 1, offset: 0 },
            end: { line: 1, col: 10, offset: 10 },
            extra: {
              message: "Test finding",
              metadata: { category: "security" },
              severity: "ERROR",
              fingerprint: "abc123",
              lines: "test code",
              validation_state: "NO_VALIDATOR",
              engine_kind: "OSS",
            },
          },
        ],
        errors: [],
        paths: { scanned: ["test.py"] },
        skipped_rules: [],
      };

      const result = ReportParser.parse(newSemgrepData);
      expect(result.format).toBe("semgrep");
      expect(result.results).toHaveLength(1);
      expect(result.results[0].startLine).toBe(1);
      expect(result.results[0].startColumn).toBe(1);
    });

    it("should detect old Semgrep format with direct line/column fields", () => {
      const oldSemgrepData: SemgrepOutput = {
        version: "0.100.0",
        results: [
          {
            check_id: "test.rule",
            path: "test.py",
            line: 10,
            column: 5,
            end_line: 10,
            end_column: 20,
            message: "Test finding",
            severity: "ERROR",
            metadata: { category: "security" },
            extra: { lines: "test code" },
          },
        ],
        errors: [],
        paths: { scanned: ["test.py"] },
      };

      const result = ReportParser.parse(oldSemgrepData);
      expect(result.format).toBe("semgrep");
      expect(result.results).toHaveLength(1);
      expect(result.results[0].startLine).toBe(10);
      expect(result.results[0].startColumn).toBe(5);
    });

    it("should detect empty Semgrep results", () => {
      const emptySemgrepData: SemgrepOutput = {
        version: "1.107.0",
        results: [],
        errors: [],
        paths: { scanned: ["src"] },
        skipped_rules: [],
      };

      const result = ReportParser.parse(emptySemgrepData);
      expect(result.format).toBe("semgrep");
      expect(result.results).toHaveLength(0);
      expect(result.summary.totalFindings).toBe(0);
    });

    it("should detect SARIF format", () => {
      const sarifData: SarifLog = {
        version: "2.1.0",
        $schema:
          "https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json",
        runs: [
          {
            tool: {
              driver: {
                name: "TestTool",
                version: "1.0.0",
                rules: [],
              },
            },
            results: [
              {
                ruleId: "test-rule",
                message: { text: "Test message" },
                locations: [
                  {
                    physicalLocation: {
                      artifactLocation: { uri: "test.js" },
                      region: { startLine: 1 },
                    },
                  },
                ],
              },
            ],
          },
        ],
      };

      const result = ReportParser.parse(sarifData);
      expect(result.format).toBe("sarif");
    });

    it("should detect GitLab SAST format", () => {
      const gitlabData: GitLabSastReport = {
        version: "14.0.0",
        vulnerabilities: [
          {
            id: "test-id",
            category: "sast",
            name: "Test vulnerability",
            description: "Test vulnerability description",
            scanner: {
              id: "test-scanner",
              name: "Test Scanner",
            },
            location: {
              file: "test.js",
              start_line: 1,
            },
            identifiers: [
              {
                type: "test",
                name: "Test",
                value: "test-value",
              },
            ],
            message: "Test vulnerability",
            severity: "High",
            confidence: "High",
          },
        ],
        scan: {
          status: "success",
          type: "sast",
          analyzer: {
            id: "test-analyzer",
            name: "Test Analyzer",
            version: "1.0.0",
          },
          scanner: {
            id: "test-scanner",
            name: "Test Scanner",
            version: "1.0.0",
          },
          start_time: "2024-01-01T00:00:00",
          end_time: "2024-01-01T00:01:00",
        },
      };

      const result = ReportParser.parse(gitlabData);
      expect(result.format).toBe("gitlab-sast");
    });

    it("should detect GitLab SAST format with empty vulnerabilities", () => {
      const gitlabData: GitLabSastReport = {
        version: "14.0.0",
        vulnerabilities: [],
        scan: {
          status: "success",
          type: "sast",
          analyzer: {
            id: "test-analyzer",
            name: "Test Analyzer",
            version: "1.0.0",
          },
          scanner: {
            id: "test-scanner",
            name: "Test Scanner",
            version: "1.0.0",
          },
          start_time: "2024-01-01T00:00:00",
          end_time: "2024-01-01T00:01:00",
        },
      };

      const result = ReportParser.parse(gitlabData);
      expect(result.format).toBe("gitlab-sast");
      expect(result.results).toHaveLength(0);
    });

    it("should throw error for unsupported format", () => {
      const unsupportedData = {
        someField: "value",
        otherField: ["array"],
      };

      expect(() => ReportParser.parse(unsupportedData)).toThrow(
        "Unsupported format. Please provide a valid SARIF, Semgrep, or GitLab SAST JSON file.",
      );
    });

    it("should reject invalid Semgrep format", () => {
      const invalidData = {
        results: [
          {
            // Missing required fields like check_id and path
            message: "Test",
            severity: "ERROR",
          },
        ],
        errors: [],
      };

      expect(() => ReportParser.parse(invalidData)).toThrow("Unsupported format");
    });
  });

  describe("getFormatDisplayName", () => {
    it("should return correct display names", () => {
      expect(ReportParser.getFormatDisplayName("sarif")).toBe("SARIF");
      expect(ReportParser.getFormatDisplayName("semgrep")).toBe("Semgrep");
      expect(ReportParser.getFormatDisplayName("gitlab-sast")).toBe("GitLab SAST");
    });
  });

  describe("validateFile", () => {
    it("should accept valid JSON files", async () => {
      const validFile = new File(["{}"], "test.json", {
        type: "application/json",
      });
      await expect(ReportParser.validateFile(validFile)).resolves.toBeUndefined();
    });

    it("should accept SARIF files", async () => {
      const sarifFile = new File(["{}"], "test.sarif", {
        type: "application/json",
      });
      await expect(ReportParser.validateFile(sarifFile)).resolves.toBeUndefined();
    });

    it("should reject non-JSON files", async () => {
      const invalidFile = new File(["test"], "test.txt", {
        type: "text/plain",
      });
      await expect(ReportParser.validateFile(invalidFile)).rejects.toThrow(
        "Please upload a JSON or SARIF file",
      );
    });

    it("should reject files larger than 50MB", async () => {
      // Create a large file (51MB) - use a more efficient approach
      const largePart = "a".repeat(1024 * 1024); // 1MB string
      const parts = new Array(51).fill(largePart); // 51 parts of 1MB each
      const largeFile = new File(parts, "large.json", {
        type: "application/json",
      });
      await expect(ReportParser.validateFile(largeFile)).rejects.toThrow(
        "File size exceeds 50MB limit",
      );
    }, 10000); // Increase timeout to 10 seconds
  });
});
