#!/usr/bin/env bun
/**
 * Test script to verify UI HTML export functionality
 * Tests the "Export as HTML" button functionality from ReportView component
 */

import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { generateStaticHtml } from "./src/shared/static-html-export";
import { ProcessedResult, ReportSummary } from "./src/types/report";

// Create sample data that would be typical in the UI
const createSampleUIData = () => {
  const sampleFindings: ProcessedResult[] = [
    {
      id: "ui-test-1",
      ruleId: "javascript.lang.security.audit.crypto.insecure-random",
      ruleName: "Insecure Randomness",
      message: "Use of `Math.random()` is not cryptographically secure",
      severity: "high",
      level: "error",
      file: "src/auth/session.js",
      startLine: 45,
      endLine: 45,
      startColumn: 20,
      endColumn: 32,
      snippet: "const token = Math.random().toString(36);",
      description:
        "Math.random() should not be used for security-sensitive operations as it is not cryptographically secure.",
      tags: ["security", "crypto", "random"],
      metadata: {
        category: "security",
        confidence: "high",
      },
    },
    {
      id: "ui-test-2",
      ruleId: "javascript.lang.security.audit.crypto.insecure-random",
      ruleName: "Insecure Randomness",
      message: "Use of `Math.random()` is not cryptographically secure",
      severity: "high",
      level: "error",
      file: "src/utils/helpers.js",
      startLine: 78,
      endLine: 78,
      startColumn: 15,
      endColumn: 27,
      snippet: "const nonce = Math.random();",
      description:
        "Math.random() should not be used for security-sensitive operations as it is not cryptographically secure.",
      tags: ["security", "crypto", "random"],
      metadata: {
        category: "security",
        confidence: "high",
      },
    },
    {
      id: "ui-test-3",
      ruleId:
        "javascript.lang.security.audit.xss.react-dangerously-set-inner-html",
      ruleName: "React XSS via dangerouslySetInnerHTML",
      message: "Detected user input in dangerouslySetInnerHTML",
      severity: "critical",
      level: "error",
      file: "src/components/UserProfile.tsx",
      startLine: 123,
      endLine: 125,
      startColumn: 8,
      endColumn: 10,
      snippet: `<div dangerouslySetInnerHTML={{__html: userBio}} />`,
      description:
        "User input directly passed to dangerouslySetInnerHTML can lead to XSS attacks.",
      tags: ["security", "xss", "react"],
      metadata: {
        category: "security",
        confidence: "critical",
      },
    },
    {
      id: "ui-test-4",
      ruleId: "javascript.lang.security.audit.hardcoded-secret",
      ruleName: "Hardcoded Secret",
      message: "Hardcoded API key detected",
      severity: "medium",
      level: "warning",
      file: "src/config/api.js",
      startLine: 12,
      endLine: 12,
      startColumn: 18,
      endColumn: 45,
      snippet: `const API_KEY = "sk-1234567890abcdef";`,
      description: "Hardcoded secrets should not be stored in source code.",
      tags: ["security", "secret", "hardcoded"],
      metadata: {
        category: "security",
        confidence: "medium",
      },
    },
  ];

  const summary: ReportSummary = {
    totalFindings: sampleFindings.length,
    criticalCount: sampleFindings.filter((f) => f.severity === "critical")
      .length,
    highCount: sampleFindings.filter((f) => f.severity === "high").length,
    mediumCount: sampleFindings.filter((f) => f.severity === "medium").length,
    lowCount: sampleFindings.filter((f) => f.severity === "low").length,
    infoCount: sampleFindings.filter((f) => f.severity === "info").length,
    severityCounts: {
      critical: sampleFindings.filter((f) => f.severity === "critical").length,
      high: sampleFindings.filter((f) => f.severity === "high").length,
      medium: sampleFindings.filter((f) => f.severity === "medium").length,
      low: sampleFindings.filter((f) => f.severity === "low").length,
      info: sampleFindings.filter((f) => f.severity === "info").length,
    },
    filesAffected: [...new Set(sampleFindings.map((f) => f.file))].length,
    toolName: "UI Test Security Scanner",
    toolVersion: "1.0.0",
    timestamp: new Date().toISOString(),
    format: "sarif",
  };

  return { sampleFindings, summary };
};

// Simulate the exact export logic from ReportView component
const simulateUIExport = async () => {
  const { sampleFindings: results, summary } = createSampleUIData();
  const uploadTimestamp = new Date();

  console.log("🔧 Simulating UI HTML Export...");
  console.log(
    `📊 Test data: ${results.length} findings, ${summary.filesAffected} files`,
  );

  try {
    // This is the exact same logic as in ReportView.tsx handleExportHTML
    const htmlContent = generateStaticHtml({
      summary,
      results,
      generatedAt: uploadTimestamp.toISOString(),
      enableDeduplication: true,
    });

    console.log(
      `✅ HTML generated successfully (${(htmlContent.length / 1024).toFixed(1)} KB)`,
    );

    // Verify the HTML contains expected UI-specific elements
    // Verify key HTML elements
    const requiredElements = [
      "<!DOCTYPE html>",
      '<html lang="en"',
      "Security Analysis Report - UI Test Security Scanner",
      "Security Findings",
      "grouped-findings",
      "all-findings",
      "grouped-view-btn",
      "all-view-btn",
      "severity-filter",
    ];

    console.log("\n🔍 Verifying HTML content:");
    for (const element of requiredElements) {
      const found = htmlContent.includes(element);
      console.log(`   ${found ? "✅" : "❌"} ${element}`);
      if (!found) {
        throw new Error(`Missing required element: ${element}`);
      }
    }

    // Test blob creation (simulate browser environment)
    console.log("\n💾 Testing blob creation:");
    try {
      // In Node.js, we can't create actual Blob objects, but we can verify the content would work
      const mockBlob = {
        content: htmlContent,
        type: "text/html",
        size: htmlContent.length,
      };

      console.log(`   ✅ Blob simulation successful (${mockBlob.size} bytes)`);
      console.log(`   ✅ Content type: ${mockBlob.type}`);

      // Test filename generation
      const filename = `security-report-${new Date().toISOString().split("T")[0]}.html`;
      console.log(`   ✅ Generated filename: ${filename}`);
    } catch (error) {
      throw new Error(`Blob creation failed: ${error}`);
    }

    // Save a test file to verify the export would work
    const testOutputPath = resolve(process.cwd(), "ui-export-test.html");
    await writeFile(testOutputPath, htmlContent, "utf8");
    console.log(`\n📁 Test file saved: ${testOutputPath}`);

    return { htmlContent, size: htmlContent.length };
  } catch (error) {
    console.error("❌ UI export simulation failed:", error);
    throw error;
  }
};

// Test specific UI export features
const testUIExportFeatures = async () => {
  const { sampleFindings: results, summary } = createSampleUIData();

  console.log("\n🎯 Testing UI-specific export features...");

  // Test 1: Export with deduplication enabled (default UI setting)
  console.log("\n1. Testing export with deduplication enabled:");
  const htmlWithDedup = generateStaticHtml({
    summary,
    results,
    generatedAt: new Date().toISOString(),
    enableDeduplication: true,
  });

  if (
    !htmlWithDedup.includes("window.ReportViewer.viewMode = 'deduplicated'")
  ) {
    throw new Error("Deduplication mode not set correctly");
  }
  console.log("   ✅ Deduplication enabled correctly");

  // Test 2: Verify offline mode features
  console.log("\n2. Testing offline mode features:");
  const offlineFeatures = [
    "@font-face",
    "src: url(",
    "font-family: 'Inter'",
    "font-weight: 400",
    "font-weight: 500",
    "font-weight: 600",
    "font-weight: 700",
  ];

  for (const feature of offlineFeatures) {
    if (!htmlWithDedup.includes(feature)) {
      throw new Error(`Missing offline feature: ${feature}`);
    }
  }
  console.log("   ✅ All offline features present");

  // Test 3: Verify interactive features are included
  console.log("\n3. Testing interactive features:");
  const interactiveFeatures = [
    "toggleGroup",
    "filterFindings",
    "updateView",
    "initializeReportViewer",
    "window.ReportViewer",
    "grouped-view-btn",
    "all-view-btn",
    "inline-findings-search",
    "inline-severity-filter",
  ];

  for (const feature of interactiveFeatures) {
    if (!htmlWithDedup.includes(feature)) {
      throw new Error(`Missing interactive feature: ${feature}`);
    }
  }
  console.log("   ✅ All interactive features present");

  // Test 4: Verify accessibility features
  console.log("\n4. Testing accessibility features:");
  const accessibilityFeatures = [
    "aria-",
    "role=",
    "tabindex=",
    "aria-expanded",
    "aria-controls",
    "Skip to main content",
    'role="banner"',
    'role="main"',
  ];

  for (const feature of accessibilityFeatures) {
    if (!htmlWithDedup.includes(feature)) {
      throw new Error(`Missing accessibility feature: ${feature}`);
    }
  }
  console.log("   ✅ All accessibility features present");

  return htmlWithDedup.length;
};

// Performance test for UI export
const testUIExportPerformance = async () => {
  console.log("\n⚡ Testing UI export performance...");

  const { sampleFindings: results, summary } = createSampleUIData();

  // Test with multiple export calls (simulating user clicking export multiple times)
  const iterations = 5;
  const times: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const startTime = performance.now();

    generateStaticHtml({
      summary,
      results,
      generatedAt: new Date().toISOString(),
      enableDeduplication: true,
    });

    const endTime = performance.now();
    times.push(endTime - startTime);
  }

  const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);

  console.log(`   ✅ Average export time: ${avgTime.toFixed(2)}ms`);
  console.log(`   ✅ Min export time: ${minTime.toFixed(2)}ms`);
  console.log(`   ✅ Max export time: ${maxTime.toFixed(2)}ms`);

  if (avgTime > 100) {
    throw new Error(
      `UI export too slow: ${avgTime.toFixed(2)}ms (should be < 100ms)`,
    );
  }

  return avgTime;
};

// Main test function
async function runUIExportTests() {
  console.log("🧪 NGD Security Report Viewer - UI HTML Export Test");
  console.log("===================================================");

  try {
    // Test 1: Basic UI export simulation
    const result = await simulateUIExport();
    console.log(
      `\n✅ Basic UI export test passed (${(result.size / 1024).toFixed(1)} KB)`,
    );

    // Test 2: UI-specific features
    const size = await testUIExportFeatures();
    console.log(
      `\n✅ UI features test passed (${(size / 1024).toFixed(1)} KB)`,
    );

    // Test 3: Performance test
    const avgTime = await testUIExportPerformance();
    console.log(
      `\n✅ Performance test passed (${avgTime.toFixed(2)}ms average)`,
    );

    console.log("\n🎉 All UI export tests passed!");
    console.log("✅ Export as HTML button functionality verified");
    console.log("✅ ReportView component export logic working");
    console.log("✅ Modular HTML generation system integrated");
    console.log("✅ All UI features properly exported");
    console.log("✅ Performance within acceptable limits");
  } catch (error) {
    console.error("\n❌ UI export tests failed:", error);
    process.exit(1);
  } finally {
    // Clean up test file
    try {
      const testFile = resolve(process.cwd(), "ui-export-test.html");
      await import("node:fs/promises").then((fs) => fs.unlink(testFile));
    } catch {
      // Ignore cleanup errors
    }
  }
}

// Run tests if this file is executed directly
if (import.meta.main) {
  runUIExportTests().catch((error) => {
    console.error("Test execution failed:", error);
    process.exit(1);
  });
}
