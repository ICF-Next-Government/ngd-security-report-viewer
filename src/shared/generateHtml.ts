/**
 * Shared HTML export logic for security reports.
 * This creates a complete static HTML file that exactly replicates the React application.
 * All assets are embedded for offline use.
 */

import { generateStaticHtml } from "./static-html-export";

// Main export with compatibility wrapper
export function generateHtml({
  summary,
  results,
  generatedAt,
  enableDeduplication = true,
}: GenerateHtmlOptions): string {
  return generateStaticHtml({
    summary,
    results,
    generatedAt,
    enableDeduplication,
  });
}

// Type exports for compatibility
export type GenerateHtmlOptions = {
  summary: import("../types/report").ReportSummary;
  results: import("../types/report").ProcessedResult[];
  generatedAt?: string;
  enableDeduplication?: boolean;
  offlineMode?: boolean; // Deprecated - all exports are offline-capable
};

// Re-export DeduplicationService for compatibility
export { DeduplicationService } from "../utils/deduplication";
