/**
 * Shared HTML export logic for security reports.
 * This creates a complete static HTML file that exactly replicates the React application.
 * All assets are embedded for offline use.
 */

import {
  generateStaticHtml,
  type GenerateStaticHtmlOptions,
} from "./static-html-export";

// Main export with compatibility wrapper
export function generateHtml({
  summary,
  results,
  generatedAt,
  enableDeduplication = true,
  offlineMode = true,
}: GenerateHtmlOptions): string {
  return generateStaticHtml({
    summary,
    results,
    generatedAt,
    enableDeduplication,
  });
}

// Type exports for compatibility
export interface GenerateHtmlOptions {
  summary: import("../types/report").ReportSummary;
  results: import("../types/report").ProcessedResult[];
  generatedAt?: string;
  enableDeduplication?: boolean;
  offlineMode?: boolean;
}

// Re-export DeduplicationService for compatibility
export { DeduplicationService } from "../utils/deduplication";
