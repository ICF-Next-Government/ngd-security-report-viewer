#!/usr/bin/env bun
/**
 * CLI to generate a static HTML report from a Semgrep SARIF JSON file.
 *
 * Usage:
 *   bun src/cli/generate-html-report.ts --input path/to/file.sarif.json --output report.html
 */

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { SarifLog } from "../types/sarif";
import { SarifParser } from "../utils/sarifParser";

// --- CLI Argument Parsing ---
function parseArgs() {
  const args = process.argv.slice(2);
  let inputPath: string | undefined;

  for (let i = 0; i < args.length; i++) {
    if ((args[i] === "--input" || args[i] === "-i") && args[i + 1]) {
      inputPath = args[i + 1];
      i++;
    }
  }

  if (!inputPath) {
    console.error("Error: --input <file> is required.");
    process.exit(1);
  }

  return { inputPath };
}

// --- HTML Report Generation (matches in-app look) ---
import { generateHtml } from "../shared/generateHtml";

// (the CLI no longer needs its own generateHtml implementation)

// --- Main CLI Logic ---
async function main() {
  const { inputPath } = parseArgs();

  let sarifRaw: string;
  try {
    sarifRaw = await readFile(inputPath, "utf8");
  } catch (err) {
    console.error(`Failed to read input file: ${inputPath}`);
    process.exit(1);
  }

  let sarifData: any;
  try {
    sarifData = JSON.parse(sarifRaw);
  } catch (err) {
    console.error("Failed to parse SARIF JSON. Is the file valid SARIF?");
    process.exit(1);
  }

  const { summary } = SarifParser.parse(sarifData);

  // Output severity counts as JSON
  const output = {
    critical: summary.criticalCount,
    high: summary.highCount,
    medium: summary.mediumCount,
    low: summary.lowCount,
    info: summary.infoCount,
  };

  console.log(JSON.stringify(output, null, 2));
}

main();
