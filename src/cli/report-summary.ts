#!/usr/bin/env bun
/**
 * CLI to generate a summary from a SARIF, Semgrep, or GitLab SAST JSON file.
 *
 * Usage:
 *   bun src/cli/report-summary.ts --input path/to/file.json
 */

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { ReportParser } from "../utils/reportParser";

// --- CLI Argument Parsing ---
function parseArgs() {
  const args = process.argv.slice(2);
  let inputPath: string | undefined;

  // Check for help flag
  if (args.includes("--help") || args.includes("-h") || args.length === 0) {
    console.log(`
Security Report Summary Generator

Usage:
  bun src/cli/report-summary.ts --input <file>

Options:
  -i, --input <file>  Path to SARIF, Semgrep, or GitLab SAST JSON file (required)
  -h, --help          Show this help message

Examples:
  # Generate summary from SARIF file
  bun src/cli/report-summary.ts --input scan.sarif.json

  # Generate summary from Semgrep JSON
  bun src/cli/report-summary.ts --input semgrep_output.json

  # Generate summary from GitLab SAST JSON
  bun src/cli/report-summary.ts -i gl-sast-report.json

Output:
  Returns JSON with detailed summary information:
  {
    "timestamp": 1703123456,
    "tool": "Semgrep (GitLab) v1.110.0 (GITLAB-SAST)",
    "total_findings": 530,
    "files_affected": 191,
    "severity": {
      "critical": 0,
      "high": 5,
      "medium": 12,
      "low": 3,
      "info": 1
    }
  }

Supported formats:
  - SARIF v2.1.0
  - Semgrep JSON output
  - GitLab SAST JSON format
`);
    process.exit(0);
  }

  for (let i = 0; i < args.length; i++) {
    if ((args[i] === "--input" || args[i] === "-i") && args[i + 1]) {
      inputPath = args[i + 1];
      i++;
    }
  }

  if (!inputPath) {
    console.error("Error: --input <file> is required.");
    console.error("Run with --help for usage information.");
    process.exit(1);
  }

  return { inputPath };
}

// --- Helper Functions ---
function generateUnixTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

function formatToolInfo(toolName: string, toolVersion?: string, format?: string): string {
  let toolInfo = toolName;

  if (toolVersion) {
    toolInfo += ` v${toolVersion}`;
  }

  if (format) {
    const formatLabel = format.toUpperCase().replace('-', '-');
    toolInfo += ` (${formatLabel})`;
  }

  return toolInfo;
}

// --- Main CLI Logic ---
async function main() {
  const { inputPath } = parseArgs();

  let fileContent: string;
  try {
    fileContent = await readFile(inputPath, "utf8");
  } catch (err) {
    console.error(`❌ Failed to read input file: ${inputPath}`);
    console.error(`   Make sure the file exists and is readable.`);
    process.exit(1);
  }

  let jsonData: any;
  try {
    jsonData = JSON.parse(fileContent);
  } catch (err) {
    console.error(
      "❌ Failed to parse JSON. The file doesn't appear to be valid JSON.",
    );
    console.error(
      `   Error: ${err instanceof Error ? err.message : "Unknown error"}`,
    );
    process.exit(1);
  }

  let results, summary;
  try {
    const parsed = ReportParser.parse(jsonData);
    results = parsed.results;
    summary = parsed.summary;
  } catch (err) {
    console.error(
      `❌ Failed to parse report: ${err instanceof Error ? err.message : "Unknown error"}`,
    );
    console.error(
      "   The file doesn't appear to be a valid SARIF, Semgrep, or GitLab SAST report.",
    );
    process.exit(1);
  }

  // Generate enhanced output with additional information
  const output = {
    timestamp: generateUnixTimestamp(),
    tool: formatToolInfo(summary.toolName, summary.toolVersion, summary.format),
    total_findings: summary.totalFindings,
    files_affected: summary.filesAffected,
    severity: {
      critical: summary.criticalCount,
      high: summary.highCount,
      medium: summary.mediumCount,
      low: summary.lowCount,
      info: summary.infoCount,
    },
  };

  console.log(JSON.stringify(output, null, 2));
}

main();
