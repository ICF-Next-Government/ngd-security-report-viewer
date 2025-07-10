/**
 * Shared HTML export logic for security reports.
 * This function is used by both the CLI and the UI to ensure identical output.
 *
 * This file now uses a modular architecture with components broken up into:
 * - styles.ts: CSS styles and theming
 * - findings.ts: Individual and grouped findings HTML generation
 * - summary.ts: Report summary and metadata HTML generation
 * - scripts.ts: Interactive JavaScript functionality
 * - index.ts: Main orchestrator that combines all components
 */

// Re-export the main function and types from the modular implementation
export {
  generateHtml,
  type GenerateHtmlOptions,
  type DeduplicationStats,
  generateFindingsSectionHtml,
  generateSummaryHtml,
  generateReportHeaderHtml,
  DeduplicationService,
} from "./html-generation";

// Re-export specific components for advanced usage
export {
  generateFindingHtml,
  generateGroupHtml,
  generateGroupedFindingsHtml,
  generateAllFindingsHtml,
} from "./html-generation/findings";

export {
  generateReportMetadataHtml,
  generateDeduplicationSummaryHtml,
  generateSeverityCardsHtml,
  generateSeverityDistributionHtml,
} from "./html-generation/summary";

export {
  getAllStyles,
  SEVERITY_COLORS,
  type SeverityLevel,
} from "./html-generation/styles";

export {
  generateReportScripts,
  generateInlineHandlers,
} from "./html-generation/scripts";
