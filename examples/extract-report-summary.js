#!/usr/bin/env node

/**
 * Example script showing how to extract the report summary from a statically exported HTML file
 *
 * The report summary is stored as a base64-encoded JSON string in the data-report-summary attribute
 * of the HTML element. This allows the data to be safely embedded without HTML escaping issues.
 *
 * Usage:
 *   node extract-report-summary.js path/to/report.html
 *   node extract-report-summary.js path/to/report.html --json
 */

import fs from "fs";
import path from "path";

// Get the HTML file path from command line arguments
const htmlFilePath = process.argv[2];

if (!htmlFilePath) {
  console.error("Usage: node extract-report-summary.js <path-to-html-file>");
  process.exit(1);
}

// Read the HTML file
let htmlContent;
try {
  htmlContent = fs.readFileSync(htmlFilePath, "utf8");
} catch (error) {
  console.error(`Error reading file: ${error.message}`);
  process.exit(1);
}

// Extract the data-report-summary attribute (contains base64-encoded JSON)
const match = htmlContent.match(/data-report-summary="([^"]+)"/);

if (!match) {
  console.error(
    "Could not find data-report-summary attribute in the HTML file",
  );
  process.exit(1);
}

// The data is base64-encoded to avoid HTML escaping issues
// Decode base64 and parse JSON
const base64Data = match[1];
let reportSummary;
try {
  // Decode base64 to get JSON string
  const jsonString = Buffer.from(base64Data, "base64").toString("utf-8");
  reportSummary = JSON.parse(jsonString);
} catch (error) {
  console.error(`Error decoding/parsing data: ${error.message}`);
  console.error("Base64 data:", base64Data);
  process.exit(1);
}

// Display the report summary
console.log("Report Summary:");
console.log("==============");
console.log(
  `Timestamp: ${new Date(reportSummary.timestamp * 1000).toISOString()}`,
);
console.log(`Tool: ${reportSummary.tool}`);
console.log(`Total Findings: ${reportSummary.total_findings}`);
console.log(`Files Affected: ${reportSummary.files_affected}`);
console.log("\nSeverity Breakdown:");
console.log(`  Critical: ${reportSummary.severity.critical}`);
console.log(`  High: ${reportSummary.severity.high}`);
console.log(`  Medium: ${reportSummary.severity.medium}`);
console.log(`  Low: ${reportSummary.severity.low}`);
console.log(`  Info: ${reportSummary.severity.info}`);

if (reportSummary.deduplication) {
  console.log("\nDeduplication Stats:");
  console.log(`  Unique Groups: ${reportSummary.deduplication.unique_groups}`);
  console.log(
    `  Duplicate Findings: ${reportSummary.deduplication.duplicate_findings}`,
  );
  console.log(
    `  Duplication Rate: ${reportSummary.deduplication.duplication_rate}`,
  );
}

// Output as JSON (useful for piping to other tools)
if (process.argv.includes("--json")) {
  console.log("\nJSON Output:");
  console.log(JSON.stringify(reportSummary, null, 2));
}

// Example of programmatic usage
/**
 * Extracts the report summary from HTML content
 * @param {string} htmlContent - The HTML content containing the report
 * @returns {Object|null} The parsed report summary object or null if extraction fails
 */
function extractReportSummary(htmlContent) {
  const match = htmlContent.match(/data-report-summary="([^"]+)"/);
  if (!match) return null;

  try {
    // Decode the base64-encoded JSON data
    const base64Data = match[1];
    const jsonString = Buffer.from(base64Data, "base64").toString("utf-8");
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error extracting report summary:", error);
    return null;
  }
}

// Export for use in other scripts
export { extractReportSummary };
