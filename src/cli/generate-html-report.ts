#!/usr/bin/env bun
/**
 * CLI to generate a static HTML report from a SARIF or Semgrep JSON file.
 *
 * Usage:
 *   bun src/cli/generate-html-report.ts --input path/to/file.json --output report.html
 */

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { ReportParser } from "../utils/reportParser";

// --- CLI Argument Parsing ---
function parseArgs() {
  const args = process.argv.slice(2);
  let input: string | undefined;
  let output: string | undefined;
  let deduplicate = true;

  // Check for help flag
  if (args.includes("--help") || args.includes("-h") || args.length === 0) {
    console.log(`
Security Report HTML Generator

Usage:
  bun src/cli/generate-html-report.ts --input <file> [--output <file>] [--no-dedup]

Options:
  -i, --input <file>   Path to SARIF, Semgrep, or GitLab SAST JSON file (required)
  -o, --output <file>  Path for output HTML file (default: report.html)
  --no-dedup           Disable automatic deduplication of similar findings
  -h, --help           Show this help message

Examples:
  # Generate report from SARIF file
  bun src/cli/generate-html-report.ts --input scan.sarif.json --output report.html

  # Generate report from Semgrep JSON
  bun src/cli/generate-html-report.ts --input semgrep_output.json

  # Generate report from GitLab SAST JSON
  bun src/cli/generate-html-report.ts -i gl-sast-report.json -o security-report.html

Supported formats:
  - SARIF v2.1.0
  - Semgrep JSON output
  - GitLab SAST JSON format
`);
    process.exit(0);
  }

  for (let i = 0; i < args.length; i++) {
    if ((args[i] === "--input" || args[i] === "-i") && args[i + 1]) {
      input = args[i + 1];
      i++;
    } else if ((args[i] === "--output" || args[i] === "-o") && args[i + 1]) {
      output = args[i + 1];
      i++;
    } else if (args[i] === "--no-dedup") {
      deduplicate = false;
    }
  }

  if (!input) {
    console.error("Error: --input <file> is required.");
    console.error("Run with --help for usage information.");
    process.exit(1);
  }
  if (!output) {
    output = "report.html";
  }

  return { input, output, deduplicate };
}

// --- HTML Report Generation (matches in-app look) ---
import { generateHtml } from "../shared/generateHtml";

// (the CLI no longer needs its own generateHtml implementation)

// --- Main CLI Logic ---
async function main() {
  const { input, output, deduplicate } = parseArgs();
  const inputPath = resolve(process.cwd(), input);
  const outputPath = resolve(process.cwd(), output);

  console.log(`📄 Reading file: ${inputPath}`);

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
    console.error("❌ Failed to parse JSON. The file doesn't appear to be valid JSON.");
    console.error(`   Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    process.exit(1);
  }

  let results, summary;
  try {
    const parsed = ReportParser.parse(jsonData);
    results = parsed.results;
    summary = parsed.summary;
    console.log(`🔍 Detected format: ${summary.format.toUpperCase()}`);
    console.log(`📊 Found ${summary.totalFindings} findings in ${summary.filesAffected} files`);
  } catch (err) {
    console.error(
      `❌ Failed to parse report: ${err instanceof Error ? err.message : "Unknown error"}`,
    );
    console.error(
      "   The file doesn't appear to be a valid SARIF, Semgrep, or GitLab SAST report.",
    );
    process.exit(1);
  }
  const html = generateHtml({
    summary,
    results,
    generatedAt: new Date().toISOString(),
    enableDeduplication: deduplicate,
  });

  try {
    await writeFile(outputPath, html, "utf8");
    console.log(`✅ HTML report generated: ${outputPath}`);
    console.log(`   Total size: ${(html.length / 1024).toFixed(1)} KB`);
    if (deduplicate) {
      console.log(`   Deduplication: Enabled (use --no-dedup to disable)`);
    } else {
      console.log(`   Deduplication: Disabled`);
    }
  } catch (err) {
    console.error(`❌ Failed to write output file: ${outputPath}`);
    console.error(`   Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    process.exit(1);
  }
}

main();
