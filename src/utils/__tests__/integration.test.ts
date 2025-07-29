import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { ReportParser } from "../reportParser";
import { SEVERITY_LEVELS } from "../../constants";

describe("Integration Tests", () => {
  describe("Semgrep Format", () => {
    it("should parse the actual results.json file correctly", () => {
      // Read the actual results.json file from the project root
      const resultsPath = resolve(process.cwd(), "results.json");
      let fileContent: string;

      try {
        fileContent = readFileSync(resultsPath, "utf-8");
      } catch (error) {
        // Skip test if results.json doesn't exist
        console.log("Skipping integration test - results.json not found");
        return;
      }

      const data = JSON.parse(fileContent);
      const report = ReportParser.parse(data);

      // Verify format detection
      expect(report.format).toBe("semgrep");

      // Verify summary
      expect(report.summary.toolName).toBe("Semgrep v1.107.0 (new format)");
      expect(report.summary.toolVersion).toBe("1.107.0");
      expect(report.summary.totalFindings).toBe(13);
      expect(report.summary.filesAffected).toBe(4);

      // Verify severity counts
      expect(report.summary.criticalCount).toBe(0);
      expect(report.summary.highCount).toBe(9);
      expect(report.summary.mediumCount).toBe(4);
      expect(report.summary.lowCount).toBe(0);
      expect(report.summary.infoCount).toBe(0);

      // Verify first finding has correct structure
      const firstFinding = report.results[0];
      expect(firstFinding).toBeDefined();
      expect(firstFinding.ruleId).toBe(
        "trailofbits.python.pickles-in-numpy.pickles-in-numpy",
      );
      expect(firstFinding.file).toBe("lib/vest/vest/io.py");
      expect(firstFinding.startLine).toBe(142);
      expect(firstFinding.endLine).toBe(142);
      expect(firstFinding.startColumn).toBe(14);
      expect(firstFinding.endColumn).toBe(50);
      expect(firstFinding.severity).toBe(SEVERITY_LEVELS.HIGH);
      expect(firstFinding.message).toContain(
        "Functions reliant on pickle can result in arbitrary code execution",
      );

      // Verify new format features are captured
      expect(firstFinding.metadata?.fingerprint).toBe("requires login");
      expect(firstFinding.metadata?.engine_kind).toBe("OSS");
      expect(firstFinding.metadata?.validation_state).toBe("NO_VALIDATOR");

      // Verify tags are extracted correctly
      expect(firstFinding.tags).toContain("security");
      expect(firstFinding.tags).toContain("vuln");
      expect(firstFinding.tags).toContain("numpy");
      expect(firstFinding.tags).toContain("confidence:medium");

      // Verify a finding with fix suggestion (if any exists)
      const findingWithFix = report.results.find((r) => r.metadata?.fix);
      if (findingWithFix) {
        expect(findingWithFix.description).toContain("Suggested fix:");
      }
    });

    it("should correctly handle CWE as string (pickles-in-numpy issue)", () => {
      // Read the actual results.json file from the project root
      const resultsPath = resolve(process.cwd(), "results.json");
      let fileContent: string;

      try {
        fileContent = readFileSync(resultsPath, "utf-8");
      } catch (error) {
        // Skip test if results.json doesn't exist
        console.log("Skipping integration test - results.json not found");
        return;
      }

      const data = JSON.parse(fileContent);
      const report = ReportParser.parse(data);

      // Find the pickles-in-numpy finding
      const picklesFinding = report.results.find((r) =>
        r.ruleId.includes("pickles-in-numpy"),
      );

      expect(picklesFinding).toBeDefined();

      // Check that CWE tag is properly included
      const cweTag = picklesFinding?.tags.find((t) => t.includes("CWE-502"));
      expect(cweTag).toBe("CWE-502: Deserialization of Untrusted Data");

      // Ensure the string wasn't split into individual characters
      expect(picklesFinding?.tags).not.toContain("C");
      expect(picklesFinding?.tags).not.toContain("W");
      expect(picklesFinding?.tags).not.toContain("E");
      expect(picklesFinding?.tags).not.toContain("-");
      expect(picklesFinding?.tags).not.toContain("5");
      expect(picklesFinding?.tags).not.toContain("0");
      expect(picklesFinding?.tags).not.toContain("2");
      expect(picklesFinding?.tags).not.toContain(":");

      // Verify other tags are also present
      expect(picklesFinding?.tags).toContain("security");
      expect(picklesFinding?.tags).toContain("vuln");
      expect(picklesFinding?.tags).toContain("numpy");
    });
  });
});
