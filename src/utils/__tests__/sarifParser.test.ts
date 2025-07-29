import { describe, it, expect } from "vitest";
import { SarifParser } from "../sarifParser";
import { SEVERITY_LEVELS } from "../../constants";
import type { SarifLog } from "../../types/sarif";

describe("SarifParser", () => {
  describe("parse", () => {
    it("should parse a basic SARIF report", () => {
      const sarifData: SarifLog = {
        version: "2.1.0",
        $schema:
          "https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json",
        runs: [
          {
            tool: {
              driver: {
                name: "ESLint",
                version: "8.0.0",
                rules: [
                  {
                    id: "no-unused-vars",
                    name: "Disallow Unused Variables",
                    shortDescription: {
                      text: "Variables that are declared and not used anywhere in the code are most likely an error due to incomplete refactoring",
                    },
                    fullDescription: {
                      text: "Variables that are declared and not used anywhere in the code are most likely an error due to incomplete refactoring. Such variables take up space in the code and can lead to confusion by readers.",
                    },
                    help: {
                      text: "Remove unused variables",
                    },
                    properties: {
                      tags: ["maintainability", "code-quality"],
                    },
                  },
                ],
              },
            },
            results: [
              {
                ruleId: "no-unused-vars",
                message: {
                  text: "'unusedVar' is defined but never used.",
                },
                level: "warning",
                locations: [
                  {
                    physicalLocation: {
                      artifactLocation: {
                        uri: "src/index.js",
                      },
                      region: {
                        startLine: 10,
                        endLine: 10,
                        snippet: {
                          text: "const unusedVar = 42;",
                        },
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      };

      const result = SarifParser.parse(sarifData);

      expect(result.results).toHaveLength(1);
      expect(result.results[0].ruleId).toBe("no-unused-vars");
      expect(result.results[0].ruleName).toBe("Disallow Unused Variables");
      expect(result.results[0].message).toBe(
        "'unusedVar' is defined but never used.",
      );
      expect(result.results[0].severity).toBe(SEVERITY_LEVELS.MEDIUM);
      expect(result.results[0].level).toBe("warning");
      expect(result.results[0].file).toBe("src/index.js");
      expect(result.results[0].startLine).toBe(10);
      expect(result.results[0].endLine).toBe(10);
      expect(result.results[0].snippet).toBe("const unusedVar = 42;");
      expect(result.results[0].tags).toContain("maintainability");
      expect(result.results[0].tags).toContain("code-quality");

      expect(result.summary.toolName).toBe("ESLint");
      expect(result.summary.toolVersion).toBe("8.0.0");
      expect(result.summary.totalFindings).toBe(1);
      expect(result.summary.mediumCount).toBe(1);
      expect(result.summary.filesAffected).toBe(1);
    });

    it("should parse SARIF with security-severity scores", () => {
      const sarifData: SarifLog = {
        version: "2.1.0",
        runs: [
          {
            tool: {
              driver: {
                name: "SecurityScanner",
                version: "1.0.0",
              },
            },
            results: [
              {
                ruleId: "sql-injection",
                message: {
                  text: "Potential SQL injection vulnerability",
                },
                level: "error",
                properties: {
                  "security-severity": "8.5",
                },
                locations: [
                  {
                    physicalLocation: {
                      artifactLocation: {
                        uri: "api/users.js",
                      },
                      region: {
                        startLine: 25,
                      },
                    },
                  },
                ],
              },
              {
                ruleId: "weak-crypto",
                message: {
                  text: "Weak cryptographic algorithm",
                },
                level: "warning",
                properties: {
                  "security-severity": "4.5",
                },
                locations: [
                  {
                    physicalLocation: {
                      artifactLocation: {
                        uri: "lib/crypto.js",
                      },
                      region: {
                        startLine: 15,
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      };

      const result = SarifParser.parse(sarifData);

      expect(result.results).toHaveLength(2);
      expect(result.results[0].severity).toBe(SEVERITY_LEVELS.HIGH);
      expect(result.results[1].severity).toBe(SEVERITY_LEVELS.MEDIUM);
      expect(result.summary.highCount).toBe(1);
      expect(result.summary.mediumCount).toBe(1);
    });

    it("should handle SARIF with rules in tool.driver.rules", () => {
      const sarifData: SarifLog = {
        version: "2.1.0",
        runs: [
          {
            tool: {
              driver: {
                name: "CustomScanner",
                version: "2.0.0",
                rules: [
                  {
                    id: "custom-rule-001",
                    name: "Custom Security Rule",
                    properties: {
                      "security-severity": "9.0",
                      tags: ["security", "custom"],
                    },
                  },
                ],
              },
            },
            results: [
              {
                ruleId: "custom-rule-001",
                message: {
                  text: "Custom security issue detected",
                },
                locations: [
                  {
                    physicalLocation: {
                      artifactLocation: {
                        uri: "src/custom.js",
                      },
                      region: {
                        startLine: 100,
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      };

      const result = SarifParser.parse(sarifData);

      expect(result.results).toHaveLength(1);
      expect(result.results[0].ruleName).toBe("Custom Security Rule");
      expect(result.results[0].severity).toBe(SEVERITY_LEVELS.CRITICAL);
      expect(result.results[0].tags).toContain("security");
      expect(result.results[0].tags).toContain("custom");
    });

    it("should handle SARIF with missing optional fields", () => {
      const sarifData: SarifLog = {
        version: "2.1.0",
        runs: [
          {
            tool: {
              driver: {
                name: "MinimalScanner",
              },
            },
            results: [
              {
                message: {
                  text: "Issue without rule ID",
                },
                locations: [
                  {
                    physicalLocation: {
                      artifactLocation: {
                        uri: "file.js",
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      };

      const result = SarifParser.parse(sarifData);

      expect(result.results).toHaveLength(1);
      expect(result.results[0].ruleId).toBe("unknown-rule");
      expect(result.results[0].ruleName).toBe("unknown-rule");
      expect(result.results[0].level).toBe("info");
      expect(result.results[0].severity).toBe(SEVERITY_LEVELS.INFO);
      expect(result.results[0].startLine).toBeUndefined();
      expect(result.results[0].endLine).toBeUndefined();
      expect(result.results[0].snippet).toBeUndefined();
      expect(result.results[0].tags).toEqual([]);
    });

    it("should handle multiple runs in SARIF", () => {
      const sarifData: SarifLog = {
        version: "2.1.0",
        runs: [
          {
            tool: {
              driver: {
                name: "Scanner1",
                version: "1.0",
              },
            },
            results: [
              {
                ruleId: "rule1",
                message: { text: "Issue from scanner 1" },
                level: "error",
                locations: [
                  {
                    physicalLocation: {
                      artifactLocation: { uri: "file1.js" },
                      region: { startLine: 1 },
                    },
                  },
                ],
              },
            ],
          },
          {
            tool: {
              driver: {
                name: "Scanner2",
                version: "2.0",
              },
            },
            results: [
              {
                ruleId: "rule2",
                message: { text: "Issue from scanner 2" },
                level: "warning",
                locations: [
                  {
                    physicalLocation: {
                      artifactLocation: { uri: "file2.js" },
                      region: { startLine: 2 },
                    },
                  },
                ],
              },
            ],
          },
        ],
      };

      const result = SarifParser.parse(sarifData);

      expect(result.results).toHaveLength(2);
      expect(result.results[0].id).toBe("0-0");
      expect(result.results[1].id).toBe("1-0");
      expect(result.results[0].message).toBe("Issue from scanner 1");
      expect(result.results[1].message).toBe("Issue from scanner 2");
      // The summary should use the last run's tool info
      expect(result.summary.toolName).toBe("Scanner2");
      expect(result.summary.toolVersion).toBe("2.0");
      expect(result.summary.filesAffected).toBe(2);
    });

    it("should normalize SARIF severity levels correctly", () => {
      const sarifData: SarifLog = {
        version: "2.1.0",
        runs: [
          {
            tool: {
              driver: {
                name: "TestScanner",
                version: "1.0.0",
              },
            },
            results: [
              {
                ruleId: "test-error",
                message: { text: "Error level" },
                level: "error",
                locations: [
                  {
                    physicalLocation: {
                      artifactLocation: { uri: "test.js" },
                      region: { startLine: 1 },
                    },
                  },
                ],
              },
              {
                ruleId: "test-warning",
                message: { text: "Warning level" },
                level: "warning",
                locations: [
                  {
                    physicalLocation: {
                      artifactLocation: { uri: "test.js" },
                      region: { startLine: 2 },
                    },
                  },
                ],
              },
              {
                ruleId: "test-note",
                message: { text: "Note level" },
                level: "note",
                locations: [
                  {
                    physicalLocation: {
                      artifactLocation: { uri: "test.js" },
                      region: { startLine: 3 },
                    },
                  },
                ],
              },
            ],
          },
        ],
      };

      const result = SarifParser.parse(sarifData);

      expect(result.results[0].severity).toBe(SEVERITY_LEVELS.HIGH);
      expect(result.results[1].severity).toBe(SEVERITY_LEVELS.MEDIUM);
      expect(result.results[2].severity).toBe(SEVERITY_LEVELS.INFO);

      expect(result.summary.highCount).toBe(1);
      expect(result.summary.mediumCount).toBe(1);
      expect(result.summary.lowCount).toBe(0);
      expect(result.summary.infoCount).toBe(1);
    });
  });
});
