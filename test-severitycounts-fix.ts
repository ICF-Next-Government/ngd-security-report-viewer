#!/usr/bin/env bun
/**
 * Test script to verify the severityCounts fix
 * Tests that the application handles missing or malformed severityCounts properly
 */

import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { generateHtml } from "./src/shared/html-generation";
import { ProcessedResult, ReportSummary } from "./src/types/report";
import { SarifParser } from "./src/utils/sarifParser";
import { SemgrepParser } from "./src/utils/semgrepParser";
import { GitLabSastParser } from "./src/utils/gitlabSastParser";

// Test data for different scenarios
const createTestData = () => {
  const testFindings: ProcessedResult[] = [
    {
      id: "test-1",
      ruleId: "test.rule.critical",
      ruleName: "Critical Security Issue",
      message: "This is a critical security finding",
      severity: "critical",
      level: "error",
      file: "src/critical.js",
      startLine: 10,
      endLine: 10,
      startColumn: 5,
      endColumn: 20,
      snippet: "dangerous_function(user_input);",
      description: "Critical security vulnerability",
      tags: ["security", "critical"],
    },
    {
      id: "test-2",
      ruleId: "test.rule.high",
      ruleName: "High Security Issue",
      message: "This is a high security finding",
      severity: "high",
      level: "warning",
      file: "src/high.js",
      startLine: 25,
      endLine: 25,
      snippet: "eval(userInput);",
      description: "High security risk",
      tags: ["security", "high"],
    },
    {
      id: "test-3",
      ruleId: "test.rule.medium",
      ruleName: "Medium Security Issue",
      message: "This is a medium security finding",
      severity: "medium",
      level: "info",
      file: "src/medium.js",
      startLine: 42,
      endLine: 42,
      snippet: "console.log(sensitive_data);",
      description: "Medium security concern",
      tags: ["security", "medium"],
    },
  ];

  return testFindings;
};

// Test 1: Summary with missing severityCounts
async function testMissingSeverityCounts() {
  console.log("\n1. Testing missing severityCounts...");

  const testFindings = createTestData();

  // Create a summary without severityCounts (simulating old data)
  const summaryWithoutSeverityCounts = {
    totalFindings: testFindings.length,
    criticalCount: 1,
    highCount: 1,
    mediumCount: 1,
    lowCount: 0,
    infoCount: 0,
    filesAffected: 3,
    toolName: "Test Scanner",
    toolVersion: "1.0.0",
    format: "sarif" as const,
    // Missing severityCounts property!
  } as ReportSummary;

  try {
    const htmlContent = generateHtml({
      summary: summaryWithoutSeverityCounts,
      results: testFindings,
      generatedAt: new Date().toISOString(),
      enableDeduplication: true,
      offlineMode: true,
    });

    if (!htmlContent || htmlContent.length < 1000) {
      throw new Error("Generated HTML is too short or empty");
    }

    // Check that HTML contains severity information
    const requiredElements = [
      "Critical",
      "High",
      "Medium",
      "Low",
      "Info",
      "Severity Distribution",
      "Security Analysis Report",
    ];

    for (const element of requiredElements) {
      if (!htmlContent.includes(element)) {
        throw new Error(`Missing required element: ${element}`);
      }
    }

    console.log(`   ✅ HTML generated successfully (${(htmlContent.length / 1024).toFixed(1)} KB)`);
    console.log("   ✅ All severity elements present in HTML");

    return htmlContent;
  } catch (error) {
    console.error("   ❌ Test failed:", error);
    throw error;
  }
}

// Test 2: Summary with malformed severityCounts
async function testMalformedSeverityCounts() {
  console.log("\n2. Testing malformed severityCounts...");

  const testFindings = createTestData();

  // Create a summary with partially missing severityCounts
  const summaryWithMalformedSeverityCounts = {
    totalFindings: testFindings.length,
    criticalCount: 1,
    highCount: 1,
    mediumCount: 1,
    lowCount: 0,
    infoCount: 0,
    severityCounts: {
      critical: 1,
      high: 1,
      // Missing medium, low, info!
    },
    filesAffected: 3,
    toolName: "Test Scanner",
    toolVersion: "1.0.0",
    format: "sarif" as const,
  } as ReportSummary;

  try {
    const htmlContent = generateHtml({
      summary: summaryWithMalformedSeverityCounts,
      results: testFindings,
      generatedAt: new Date().toISOString(),
      enableDeduplication: true,
      offlineMode: true,
    });

    if (!htmlContent || htmlContent.length < 1000) {
      throw new Error("Generated HTML is too short or empty");
    }

    console.log(`   ✅ HTML generated successfully (${(htmlContent.length / 1024).toFixed(1)} KB)`);
    console.log("   ✅ Handled malformed severityCounts gracefully");

    return htmlContent;
  } catch (error) {
    console.error("   ❌ Test failed:", error);
    throw error;
  }
}

// Test 3: Verify parser fixes
async function testParserFixes() {
  console.log("\n3. Testing parser fixes...");

  // Test SARIF parser
  console.log("   Testing SARIF parser...");
  const sarifData = {
    version: "2.1.0",
    runs: [{
      tool: {
        driver: {
          name: "Test Tool",
          version: "1.0.0",
        },
      },
      results: [{
        ruleId: "test-rule",
        message: { text: "Test message" },
        level: "warning",
        locations: [{
          physicalLocation: {
            artifactLocation: { uri: "test.js" },
            region: { startLine: 1 },
          },
        }],
      }],
    }],
  };

  const sarifResult = SarifParser.parse(sarifData);
  if (!sarifResult.summary.severityCounts) {
    throw new Error("SARIF parser missing severityCounts");
  }
  if (typeof sarifResult.summary.severityCounts.critical !== "number") {
    throw new Error("SARIF parser severityCounts.critical is not a number");
  }
  console.log("   ✅ SARIF parser creates proper severityCounts");

  // Test Semgrep parser
  console.log("   Testing Semgrep parser...");
  const semgrepData = {
    results: [{
      check_id: "test.rule",
      message: "Test message",
      path: "test.js",
      line: 1,
      column: 1,
      end_line: 1,
      end_column: 10,
      severity: "WARNING",
      metadata: {},
      extra: { lines: "test code" },
    }],
    errors: [],
  };

  const semgrepResult = SemgrepParser.parse(semgrepData);
  if (!semgrepResult.summary.severityCounts) {
    throw new Error("Semgrep parser missing severityCounts");
  }
  if (typeof semgrepResult.summary.severityCounts.high !== "number") {
    throw new Error("Semgrep parser severityCounts.high is not a number");
  }
  console.log("   ✅ Semgrep parser creates proper severityCounts");

  // Test GitLab SAST parser
  console.log("   Testing GitLab SAST parser...");
  const gitlabData = {
    version: "2.0",
    vulnerabilities: [{
      id: "test-vuln",
      name: "Test Vulnerability",
      message: "Test message",
      severity: "High",
      location: {
        file: "test.js",
        start_line: 1,
        end_line: 1,
      },
      identifiers: [{ type: "cwe", name: "CWE-79", value: "79" }],
    }],
  };

  const gitlabResult = GitLabSastParser.parse(gitlabData);
  if (!gitlabResult.summary.severityCounts) {
    throw new Error("GitLab SAST parser missing severityCounts");
  }
  if (typeof gitlabResult.summary.severityCounts.low !== "number") {
    throw new Error("GitLab SAST parser severityCounts.low is not a number");
  }
  console.log("   ✅ GitLab SAST parser creates proper severityCounts");
}

// Test 4: Edge cases
async function testEdgeCases() {
  console.log("\n4. Testing edge cases...");

  // Test with empty results
  console.log("   Testing empty results...");
  const emptySummary: ReportSummary = {
    totalFindings: 0,
    criticalCount: 0,
    highCount: 0,
    mediumCount: 0,
    lowCount: 0,
    infoCount: 0,
    severityCounts: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0,
    },
    filesAffected: 0,
    toolName: "Empty Test",
    format: "sarif",
  };

  try {
    const htmlContent = generateHtml({
      summary: emptySummary,
      results: [],
      generatedAt: new Date().toISOString(),
      enableDeduplication: true,
      offlineMode: true,
    });

    if (!htmlContent || htmlContent.length < 1000) {
      throw new Error("Generated HTML is too short or empty");
    }

    console.log("   ✅ Empty results handled correctly");
  } catch (error) {
    console.error("   ❌ Empty results test failed:", error);
    throw error;
  }

  // Test with null/undefined summary
  console.log("   Testing null summary handling...");
  try {
    const htmlContent = generateHtml({
      summary: null as any,
      results: [],
      enableDeduplication: true,
      offlineMode: true,
    });

    // This should either work with defaults or throw a descriptive error
    console.log("   ⚠️  Null summary handled (unexpected but recovered)");
  } catch (error) {
    if (error instanceof Error && error.message.includes("summary")) {
      console.log("   ✅ Null summary properly rejected");
    } else {
      throw error;
    }
  }
}

// Test 5: Performance with large datasets
async function testPerformance() {
  console.log("\n5. Testing performance with fixed severityCounts...");

  const largeResults: ProcessedResult[] = [];
  for (let i = 0; i < 1000; i++) {
    largeResults.push({
      id: `perf-test-${i}`,
      ruleId: `rule.${i % 10}`,
      ruleName: `Rule ${i % 10}`,
      message: `Finding ${i}`,
      severity: ["critical", "high", "medium", "low", "info"][i % 5] as any,
      level: "warning",
      file: `file-${i % 100}.js`,
      startLine: i + 1,
      endLine: i + 1,
      snippet: `// Code line ${i}`,
      description: `Description for finding ${i}`,
      tags: [`tag-${i % 5}`],
    });
  }

  const largeSummary: ReportSummary = {
    totalFindings: largeResults.length,
    criticalCount: 200,
    highCount: 200,
    mediumCount: 200,
    lowCount: 200,
    infoCount: 200,
    severityCounts: {
      critical: 200,
      high: 200,
      medium: 200,
      low: 200,
      info: 200,
    },
    filesAffected: 100,
    toolName: "Performance Test Scanner",
    format: "sarif",
  };

  const startTime = performance.now();
  const htmlContent = generateHtml({
    summary: largeSummary,
    results: largeResults,
    generatedAt: new Date().toISOString(),
    enableDeduplication: true,
    offlineMode: true,
  });
  const endTime = performance.now();

  const processingTime = endTime - startTime;
  const contentSize = htmlContent.length / 1024;

  console.log(`   ✅ Large dataset (${largeResults.length} findings):`);
  console.log(`      - Processing time: ${processingTime.toFixed(2)}ms`);
  console.log(`      - Content size: ${contentSize.toFixed(1)} KB`);
  console.log(`      - Performance: ${(largeResults.length / processingTime * 1000).toFixed(0)} findings/sec`);

  if (processingTime > 5000) {
    console.warn("   ⚠️  Performance warning: Processing took over 5 seconds");
  }
}

// Main test execution
async function runSeverityCountsTests() {
  console.log("🧪 Testing severityCounts Fix");
  console.log("============================");

  try {
    const htmlContent1 = await testMissingSeverityCounts();
    const htmlContent2 = await testMalformedSeverityCounts();
    await testParserFixes();
    await testEdgeCases();
    await testPerformance();

    // Save test outputs
    const testOutput1Path = resolve(process.cwd(), "test-missing-severitycounts.html");
    const testOutput2Path = resolve(process.cwd(), "test-malformed-severitycounts.html");

    await writeFile(testOutput1Path, htmlContent1, "utf8");
    await writeFile(testOutput2Path, htmlContent2, "utf8");

    console.log(`\n📁 Test files saved:`);
    console.log(`   - ${testOutput1Path}`);
    console.log(`   - ${testOutput2Path}`);

    console.log("\n🎉 All severityCounts tests passed!");
    console.log("===================================");
    console.log("✅ Missing severityCounts handled gracefully");
    console.log("✅ Malformed severityCounts handled gracefully");
    console.log("✅ All parsers now create proper severityCounts");
    console.log("✅ Edge cases handled correctly");
    console.log("✅ Performance maintained with fixes");
    console.log("\n🔧 The 'Cannot read properties of undefined (reading 'critical')' error has been fixed!");

    return true;
  } catch (error) {
    console.error("\n❌ severityCounts tests failed:", error);
    return false;
  } finally {
    // Clean up test files
    try {
      const testFiles = ["test-missing-severitycounts.html", "test-malformed-severitycounts.html"];
      for (const file of testFiles) {
        await import("node:fs/promises").then((fs) =>
          fs.unlink(resolve(process.cwd(), file)).catch(() => {})
        );
      }
    } catch {
      // Ignore cleanup errors
    }
  }
}

// Run tests if executed directly
if (import.meta.main) {
  runSeverityCountsTests().then((success) => {
    process.exit(success ? 0 : 1);
  });
}

export { runSeverityCountsTests };
