import { describe, it, expect } from "vitest";
import { SemgrepParser } from "../semgrepParser";
import { SEVERITY_LEVELS } from "../../constants";
import type { SemgrepOutput } from "../../types/semgrep";

describe("SemgrepParser", () => {
  describe("parse", () => {
    it("should parse new Semgrep format with start/end position objects", () => {
      const newFormatData: SemgrepOutput = {
        version: "1.107.0",
        results: [
          {
            check_id:
              "python.lang.security.insecure-hash-algorithms.insecure-hash-algorithm-sha1",
            path: "lib/vest/vest/test/validation/crosstab_cases.py",
            start: {
              line: 47,
              col: 16,
              offset: 1278,
            },
            end: {
              line: 47,
              col: 52,
              offset: 1314,
            },
            extra: {
              message:
                "Detected SHA1 hash algorithm which is considered insecure.",
              metadata: {
                category: "security",
                cwe: [
                  "CWE-327: Use of a Broken or Risky Cryptographic Algorithm",
                ],
                owasp: [
                  "A03:2017 - Sensitive Data Exposure",
                  "A02:2021 - Cryptographic Failures",
                ],
                technology: ["python"],
                subcategory: ["vuln"],
                likelihood: "LOW",
                impact: "MEDIUM",
                confidence: "MEDIUM",
                vulnerability_class: ["Cryptographic Issues"],
                "semgrep.dev": {
                  rule: {
                    origin: "community",
                    r_id: 9624,
                    rule_id: "x8UnBk",
                    url: "https://semgrep.dev/playground/r/d6TPjWl/python.lang.security.insecure-hash-algorithms.insecure-hash-algorithm-sha1",
                  },
                },
              },
              severity: "WARNING",
              fingerprint: "requires login",
              lines: "hashlib.sha1(fields_as_str.encode())",
              validation_state: "NO_VALIDATOR",
              engine_kind: "OSS",
            },
          },
        ],
        errors: [],
        paths: {
          scanned: ["lib/vest/vest/test/validation/crosstab_cases.py"],
        },
        skipped_rules: [],
      };

      const result = SemgrepParser.parse(newFormatData);

      expect(result.results).toHaveLength(1);
      expect(result.results[0].startLine).toBe(47);
      expect(result.results[0].endLine).toBe(47);
      expect(result.results[0].startColumn).toBe(16);
      expect(result.results[0].endColumn).toBe(52);
      expect(result.results[0].severity).toBe(SEVERITY_LEVELS.MEDIUM);
      expect(result.results[0].message).toBe(
        "Detected SHA1 hash algorithm which is considered insecure.",
      );
      expect(result.results[0].tags).toContain("security");
      expect(result.results[0].tags).toContain("python");
      expect(result.summary.totalFindings).toBe(1);
      expect(result.summary.format).toBe("semgrep");
      expect(result.summary.toolName).toBe("Semgrep v1.107.0 (new format)");
      expect(result.summary.mediumCount).toBe(1);
    });

    it("should parse old Semgrep format with direct line/column fields", () => {
      const oldFormatData: SemgrepOutput = {
        version: "0.100.0",
        results: [
          {
            check_id:
              "javascript.lang.security.detect-eval-with-expression.detect-eval-with-expression",
            path: "src/utils/dangerous.js",
            line: 10,
            column: 5,
            end_line: 10,
            end_column: 20,
            message: "Detected eval with dynamic expression",
            severity: "ERROR",
            metadata: {
              category: "security",
              technology: ["javascript"],
              confidence: "HIGH",
              impact: "HIGH",
              likelihood: "MEDIUM",
            },
            extra: {
              lines: "eval(userInput)",
            },
          },
        ],
        errors: [],
        paths: {
          scanned: ["src/utils/dangerous.js"],
        },
      };

      const result = SemgrepParser.parse(oldFormatData);

      expect(result.results).toHaveLength(1);
      expect(result.results[0].startLine).toBe(10);
      expect(result.results[0].endLine).toBe(10);
      expect(result.results[0].startColumn).toBe(5);
      expect(result.results[0].endColumn).toBe(20);
      expect(result.results[0].severity).toBe(SEVERITY_LEVELS.HIGH);
      expect(result.results[0].message).toBe(
        "Detected eval with dynamic expression",
      );
      expect(result.summary.highCount).toBe(1);
      expect(result.summary.toolName).toBe("Semgrep v0.100.0 (legacy format)");
    });

    it("should handle empty results", () => {
      const emptyData: SemgrepOutput = {
        version: "1.107.0",
        results: [],
        errors: [],
        paths: {
          scanned: ["src"],
        },
        skipped_rules: [],
      };

      const result = SemgrepParser.parse(emptyData);

      expect(result.results).toHaveLength(0);
      expect(result.summary.totalFindings).toBe(0);
      expect(result.summary.filesAffected).toBe(0);
      expect(result.summary.toolName).toBe("Semgrep v1.107.0 (new format)");
    });

    it("should extract tags from various metadata fields", () => {
      const dataWithTags: SemgrepOutput = {
        version: "1.107.0",
        results: [
          {
            check_id: "test.rule",
            path: "test.py",
            start: { line: 1, col: 1, offset: 0 },
            end: { line: 1, col: 10, offset: 10 },
            extra: {
              message: "Test finding",
              metadata: {
                category: "security",
                subcategory: ["injection", "sqli"],
                technology: ["python", "django"],
                vulnerability_class: ["SQL Injection"],
                cwe: ["CWE-89"],
                owasp: ["A03:2021"],
                confidence: "HIGH",
                "bandit-code": "B608",
                "cwe2021-top25": true,
                "cwe2022-top25": true,
              },
              severity: "ERROR",
            },
          },
        ],
        errors: [],
        paths: { scanned: ["test.py"] },
      };

      const result = SemgrepParser.parse(dataWithTags);

      const tags = result.results[0].tags;
      expect(tags).toContain("security");
      expect(tags).toContain("injection");
      expect(tags).toContain("sqli");
      expect(tags).toContain("python");
      expect(tags).toContain("django");
      expect(tags).toContain("SQL Injection");
      expect(tags).toContain("CWE-89");
      expect(tags).toContain("A03:2021");
      expect(tags).toContain("confidence:high");
      expect(tags).toContain("bandit:B608");
      expect(tags).toContain("cwe2021-top25");
      expect(tags).toContain("cwe2022-top25");
    });

    it("should handle fix suggestions in description", () => {
      const dataWithFix: SemgrepOutput = {
        version: "1.107.0",
        results: [
          {
            check_id: "test.rule",
            path: "test.py",
            start: { line: 1, col: 1, offset: 0 },
            end: { line: 1, col: 10, offset: 10 },
            extra: {
              message: "Insecure hash function",
              metadata: {
                description: "SHA1 is vulnerable to collision attacks",
                references: ["https://example.com/sha1-vulnerability"],
              },
              severity: "WARNING",
              fix: "hashlib.sha256(data.encode())",
            },
          },
        ],
        errors: [],
        paths: { scanned: ["test.py"] },
      };

      const result = SemgrepParser.parse(dataWithFix);

      const description = result.results[0].description;
      expect(description).toContain("Insecure hash function");
      expect(description).toContain("SHA1 is vulnerable to collision attacks");
      expect(description).toContain("Suggested fix:");
      expect(description).toContain("hashlib.sha256(data.encode())");
      expect(description).toContain("References:");
      expect(description).toContain("https://example.com/sha1-vulnerability");
    });

    it("should determine severity from impact/likelihood matrix", () => {
      const testCases = [
        {
          impact: "HIGH",
          likelihood: "HIGH",
          expected: SEVERITY_LEVELS.CRITICAL,
        },
        {
          impact: "HIGH",
          likelihood: "MEDIUM",
          expected: SEVERITY_LEVELS.HIGH,
        },
        {
          impact: "MEDIUM",
          likelihood: "HIGH",
          expected: SEVERITY_LEVELS.HIGH,
        },
        {
          impact: "MEDIUM",
          likelihood: "MEDIUM",
          expected: SEVERITY_LEVELS.MEDIUM,
        },
        { impact: "LOW", likelihood: "LOW", expected: SEVERITY_LEVELS.LOW },
      ];

      testCases.forEach(({ impact, likelihood, expected }) => {
        const data: SemgrepOutput = {
          version: "1.107.0",
          results: [
            {
              check_id: "test.rule",
              path: "test.py",
              start: { line: 1, col: 1, offset: 0 },
              end: { line: 1, col: 10, offset: 10 },
              extra: {
                message: "Test",
                metadata: { impact, likelihood },
                severity: "INFO",
              },
            },
          ],
          errors: [],
          paths: { scanned: ["test.py"] },
        };

        const result = SemgrepParser.parse(data);
        expect(result.results[0].severity).toBe(expected);
      });
    });

    it("should handle ASVS metadata in description", () => {
      const dataWithAsvs: SemgrepOutput = {
        version: "1.107.0",
        results: [
          {
            check_id: "test.rule",
            path: "test.py",
            start: { line: 1, col: 1, offset: 0 },
            end: { line: 1, col: 10, offset: 10 },
            extra: {
              message: "Security issue",
              metadata: {
                asvs: {
                  control_id: "6.2.2 Insecure Custom Algorithm",
                  control_url:
                    "https://github.com/OWASP/ASVS/blob/master/4.0/en/0x14-V6-Cryptography.md#v62-algorithms",
                  section: "V6 Stored Cryptography Verification Requirements",
                  version: "4",
                },
              },
              severity: "WARNING",
            },
          },
        ],
        errors: [],
        paths: { scanned: ["test.py"] },
      };

      const result = SemgrepParser.parse(dataWithAsvs);

      const description = result.results[0].description;
      expect(description).toContain("ASVS Reference:");
      expect(description).toContain("Control: 6.2.2 Insecure Custom Algorithm");
      expect(description).toContain(
        "Section: V6 Stored Cryptography Verification Requirements",
      );
    });

    it("should handle CWE and OWASP fields as both string and array", () => {
      const semgrepData: SemgrepOutput = {
        version: "1.107.0",
        results: [
          {
            check_id: "test.cwe-string",
            path: "test1.py",
            start: { line: 1, col: 1, offset: 0 },
            end: { line: 1, col: 10, offset: 10 },
            extra: {
              message: "CWE as string",
              metadata: {
                cwe: "CWE-502: Deserialization of Untrusted Data",
                owasp: "A08:2021 - Software and Data Integrity Failures",
              },
              severity: "ERROR",
            },
          },
          {
            check_id: "test.cwe-array",
            path: "test2.py",
            start: { line: 2, col: 1, offset: 20 },
            end: { line: 2, col: 10, offset: 30 },
            extra: {
              message: "CWE as array",
              metadata: {
                cwe: [
                  "CWE-89: SQL Injection",
                  "CWE-564: SQL Injection: Hibernate",
                ],
                owasp: ["A03:2021 - Injection", "A01:2017 - Injection"],
              },
              severity: "ERROR",
            },
          },
        ],
        errors: [],
        paths: { scanned: ["test1.py", "test2.py"] },
      };

      const result = SemgrepParser.parse(semgrepData);

      // Check first result with string CWE/OWASP
      expect(result.results[0].tags).toContain(
        "CWE-502: Deserialization of Untrusted Data",
      );
      expect(result.results[0].tags).toContain(
        "A08:2021 - Software and Data Integrity Failures",
      );

      // Check second result with array CWE/OWASP
      expect(result.results[1].tags).toContain("CWE-89: SQL Injection");
      expect(result.results[1].tags).toContain(
        "CWE-564: SQL Injection: Hibernate",
      );
      expect(result.results[1].tags).toContain("A03:2021 - Injection");
      expect(result.results[1].tags).toContain("A01:2017 - Injection");

      // Ensure strings weren't split into characters
      expect(result.results[0].tags).not.toContain("C");
      expect(result.results[0].tags).not.toContain("W");
      expect(result.results[0].tags).not.toContain("E");
      expect(result.results[0].tags).not.toContain("-");
      expect(result.results[0].tags).not.toContain("5");
      expect(result.results[0].tags).not.toContain("0");
      expect(result.results[0].tags).not.toContain("2");
    });

    it("should correctly identify new vs legacy Semgrep format", () => {
      // Test new format detection
      const newFormat: SemgrepOutput = {
        version: "1.107.0",
        results: [
          {
            check_id: "test.rule",
            path: "test.py",
            start: { line: 1, col: 1, offset: 0 },
            end: { line: 1, col: 10, offset: 10 },
            extra: {
              message: "Test",
              severity: "ERROR",
            },
          },
        ],
        errors: [],
        paths: { scanned: ["test.py"] },
        skipped_rules: [],
      };

      const newResult = SemgrepParser.parse(newFormat);
      expect(newResult.summary.toolName).toBe("Semgrep v1.107.0 (new format)");

      // Test legacy format detection
      const oldFormat: SemgrepOutput = {
        version: "0.100.0",
        results: [
          {
            check_id: "test.rule",
            path: "test.py",
            line: 1,
            column: 1,
            end_line: 1,
            end_column: 10,
            message: "Test",
            severity: "ERROR",
            metadata: {},
            extra: {},
          },
        ],
        errors: [],
        paths: { scanned: ["test.py"] },
      };

      const oldResult = SemgrepParser.parse(oldFormat);
      expect(oldResult.summary.toolName).toBe(
        "Semgrep v0.100.0 (legacy format)",
      );

      // Test empty results with new format indicators
      const emptyNew: SemgrepOutput = {
        version: "1.107.0",
        results: [],
        errors: [],
        paths: { scanned: [] },
        skipped_rules: ["some-rule"],
      };

      const emptyNewResult = SemgrepParser.parse(emptyNew);
      expect(emptyNewResult.summary.toolName).toBe(
        "Semgrep v1.107.0 (new format)",
      );

      // Test empty results with legacy format (no skipped_rules)
      const emptyOld: SemgrepOutput = {
        version: "0.100.0",
        results: [],
        errors: [],
        paths: { scanned: [] },
      };

      const emptyOldResult = SemgrepParser.parse(emptyOld);
      expect(emptyOldResult.summary.toolName).toBe(
        "Semgrep v0.100.0 (legacy format)",
      );
    });

    it("should correctly detect format based on version number", () => {
      // Test version 1.106.0 (should be legacy)
      const v1_106: SemgrepOutput = {
        version: "1.106.0",
        results: [],
        errors: [],
        paths: { scanned: [] },
      };
      const result1_106 = SemgrepParser.parse(v1_106);
      expect(result1_106.summary.toolName).toBe(
        "Semgrep v1.106.0 (legacy format)",
      );

      // Test version 1.107.0 (should be new format)
      const v1_107: SemgrepOutput = {
        version: "1.107.0",
        results: [],
        errors: [],
        paths: { scanned: [] },
      };
      const result1_107 = SemgrepParser.parse(v1_107);
      expect(result1_107.summary.toolName).toBe(
        "Semgrep v1.107.0 (new format)",
      );

      // Test version 1.108.5 (should be new format)
      const v1_108: SemgrepOutput = {
        version: "1.108.5",
        results: [],
        errors: [],
        paths: { scanned: [] },
      };
      const result1_108 = SemgrepParser.parse(v1_108);
      expect(result1_108.summary.toolName).toBe(
        "Semgrep v1.108.5 (new format)",
      );

      // Test version 2.0.0 (should be new format)
      const v2_0: SemgrepOutput = {
        version: "2.0.0",
        results: [],
        errors: [],
        paths: { scanned: [] },
      };
      const result2_0 = SemgrepParser.parse(v2_0);
      expect(result2_0.summary.toolName).toBe("Semgrep v2.0.0 (new format)");

      // Test when version is undefined (should default to legacy)
      const noVersion: SemgrepOutput = {
        version: "",
        results: [],
        errors: [],
        paths: { scanned: [] },
      };
      const resultNoVersion = SemgrepParser.parse(noVersion);
      expect(resultNoVersion.summary.toolName).toBe(
        "Semgrep vundefined (legacy format)",
      );
    });
  });
});
