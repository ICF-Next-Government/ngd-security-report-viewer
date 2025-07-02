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
  let input: string | undefined;
  let output: string | undefined;

  for (let i = 0; i < args.length; i++) {
    if ((args[i] === "--input" || args[i] === "-i") && args[i + 1]) {
      input = args[i + 1];
      i++;
    } else if ((args[i] === "--output" || args[i] === "-o") && args[i + 1]) {
      output = args[i + 1];
      i++;
    }
  }

  if (!input) {
    console.error("Error: --input <file> is required.");
    process.exit(1);
  }
  if (!output) {
    output = "report.html";
  }

  return { input, output };
}

// --- HTML Report Generation (matches in-app look) ---
import { generateHtml } from "../shared/generateHtml";

// (the CLI no longer needs its own generateHtml implementation)

// --- Main CLI Logic ---
async function main() {
  const { input, output } = parseArgs();
  const inputPath = resolve(process.cwd(), input);
  const outputPath = resolve(process.cwd(), output);

  let sarifRaw: string;
  try {
    sarifRaw = await readFile(inputPath, "utf8");
  } catch (err) {
    console.error(`Failed to read input file: ${inputPath}`);
    process.exit(1);
  }

  let sarifData: SarifLog;
  try {
    sarifData = JSON.parse(sarifRaw);
  } catch (err) {
    console.error("Failed to parse SARIF JSON. Is the file valid SARIF?");
    process.exit(1);
  }

  const { results, summary } = SarifParser.parse(sarifData);
  const html = generateHtml({
    summary,
    results,
    generatedAt: new Date().toISOString(),
  });

  try {
    await writeFile(outputPath, html, "utf8");
    console.log(`✅ HTML report generated: ${outputPath}`);
  } catch (err) {
    console.error(`Failed to write output file: ${outputPath}`);
    process.exit(1);
  }
}

main();
