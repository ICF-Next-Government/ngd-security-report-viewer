/**
 * Modular HTML generator for security reports
 * Orchestrates all the broken-up components for better maintainability
 */

import { ProcessedResult, ReportSummary } from "../../types/report";
import { DeduplicationService } from "../../utils/deduplication";
import { generateFindingsSectionHtml } from "./findings";
import {
  generateReportHeaderHtml,
  generateReportMetadataHtml,
  generateDeduplicationSummaryHtml,
  generateSeverityCardsHtml,
  generateSeverityDistributionHtml,
  DeduplicationStats,
} from "./summary";
import { getAllStyles } from "./styles";
import { generateReportScripts } from "./scripts";

export type GenerateHtmlOptions = {
  summary: ReportSummary;
  results: ProcessedResult[];
  generatedAt?: string; // ISO string or formatted date
  enableDeduplication?: boolean; // Whether to show deduplication by default
  offlineMode?: boolean; // Whether to embed all CSS for offline usage
};

/**
 * Escapes HTML special characters to prevent XSS
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

/**
 * Formats the timestamp for display
 */
function formatTimestamp(generatedAt?: string): string {
  if (!generatedAt) return "";

  try {
    const date = new Date(generatedAt);
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    });
  } catch (error) {
    console.warn("Invalid timestamp provided:", generatedAt);
    return "";
  }
}

/**
 * Generates the HTML document head section
 */
function generateDocumentHead(
  summary: ReportSummary,
  offlineMode: boolean,
): string {
  const title = `Security Report - ${summary.toolName || "Security Analysis"}`;

  return `
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="description" content="Security analysis report with ${summary.totalFindings} findings from ${summary.toolName}">
      <meta name="generator" content="NGD Security Report Viewer">
      <meta name="robots" content="noindex, nofollow">
      <title>${escapeHtml(title)}</title>

      <!-- Favicon -->
      <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%233b82f6' stroke-width='2'><path d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'/></svg>">

      <!-- Styles -->
      <style>
        ${getAllStyles(offlineMode)}

        /* Additional keyboard navigation styles */
        .keyboard-navigation .group-toggle:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        /* Enhanced content container styles */
        body {
          background: linear-gradient(to bottom right, #0f172a, #1e293b 80%);
        }

        /* Improved spacing and visual hierarchy */
        section {
          position: relative;
        }

        section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 1px;
          background: linear-gradient(to right, transparent, #334155, transparent);
        }

        header section::before {
          display: none;
        }

        /* Enhanced card shadows */
        .bg-slate-800\/50 {
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
        }

        /* Print styles */
        @media print {
          .view-toggle,
          .search-container {
            display: none !important;
          }

          .group-toggle .chevron {
            display: none !important;
          }

          .finding-result {
            break-inside: avoid;
            margin-bottom: 1rem;
          }

          #grouped-findings,
          #all-findings {
            display: block !important;
          }

          body {
            background: white !important;
            color: black !important;
          }

          .bg-gradient-to-br {
            background: white !important;
          }
        }
      </style>
    </head>
  `;
}

/**
 * Generates the complete HTML document structure
 */
export function generateHtml({
  summary,
  results,
  generatedAt,
  enableDeduplication = true,
  offlineMode = true,
}: GenerateHtmlOptions): string {
  // Format timestamp
  const formattedTimestamp = formatTimestamp(generatedAt);

  // Calculate deduplication statistics
  const deduplicationGroups = DeduplicationService.deduplicateFindings(results);
  const deduplicationStats: DeduplicationStats = {
    uniqueGroups: deduplicationGroups.length,
    totalDuplicates: results.length - deduplicationGroups.length,
    duplicatePercentage:
      results.length > 0
        ? (
            ((results.length - deduplicationGroups.length) / results.length) *
            100
          ).toFixed(1)
        : "0",
  };

  // Determine if we should show deduplication features
  const hasGroups = deduplicationStats.totalDuplicates > 0;
  const showDeduplicationToggle = hasGroups;

  // Generate major sections
  const documentHead = generateDocumentHead(summary, offlineMode);
  const reportHeader = generateReportHeaderHtml(summary, formattedTimestamp);
  const reportMetadata = generateReportMetadataHtml(summary);
  const deduplicationSummary = hasGroups
    ? generateDeduplicationSummaryHtml(deduplicationStats)
    : "";
  const severityCards = generateSeverityCardsHtml(summary);
  const severityDistribution = generateSeverityDistributionHtml(summary);
  const findingsSection = generateFindingsSectionHtml(
    results,
    deduplicationGroups,
    enableDeduplication && hasGroups,
    showDeduplicationToggle,
  );

  // Generate scripts
  const reportScripts = generateReportScripts(enableDeduplication && hasGroups);

  // Construct the complete HTML document
  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
${documentHead}
<body class="antialiased">
  <!-- Skip to content link for accessibility -->
  <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50">
    Skip to main content
  </a>

  <!-- Main content wrapper -->
  <div id="main-content" class="min-h-screen bg-slate-900">
    <!-- Main Title Section -->
    <div class="container mx-auto px-4 py-6">
      <div class="text-center mb-6">
        <div class="flex items-center justify-center space-x-2 mb-3">
          <div class="p-2 bg-blue-600 rounded-xl shadow-lg">
            <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-white">Security Report Viewer</h1>
        </div>
        <p class="text-lg text-slate-300 mb-4 max-w-2xl mx-auto">
          Comprehensive security analysis report generated from ${summary.format ? escapeHtml(summary.format.toUpperCase()) : "security scan"} data
        </p>
      </div>
    </div>

    <!-- Report content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      ${reportHeader}
      ${reportMetadata}
      ${deduplicationSummary}
      ${severityCards}
      ${severityDistribution}
    </div>

    <!-- Findings section -->
    <main role="main" aria-labelledby="findings-heading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <h2 id="findings-heading" class="sr-only">Security Findings</h2>
      ${findingsSection}
    </main>

    <!-- Footer -->
    <footer role="contentinfo" class="border-t border-slate-700 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center text-sm text-slate-400 space-y-2">
        <p>
          Generated by
          <a href="https://github.com/your-org/ngd-security-report-viewer"
             class="text-blue-400 hover:text-blue-300 transition-colors"
             target="_blank"
             rel="noopener noreferrer">
            NGD Security Report Viewer
          </a>
        </p>
        ${formattedTimestamp ? `<p class="mt-2">Report generated: ${escapeHtml(formattedTimestamp)}</p>` : ""}
        <div class="mt-6 pt-6 border-t border-slate-800">
          <p class="text-xs text-slate-500">
            This report contains <span class="font-semibold text-slate-400">${results.length}</span> security finding${results.length !== 1 ? "s" : ""}
            ${hasGroups ? `grouped into <span class="font-semibold text-slate-400">${deduplicationGroups.length}</span> unique issue${deduplicationGroups.length !== 1 ? "s" : ""}` : ""}
            across <span class="font-semibold text-slate-400">${summary.filesAffected}</span> file${summary.filesAffected !== 1 ? "s" : ""}.
          </p>
        </div>
      </div>
      </div>
    </footer>
  </div>

  <!-- Scripts -->
  <script>
    ${reportScripts}
  </script>

  <!-- Performance monitoring (optional) -->
  <script>
    // Simple performance monitoring
    window.addEventListener('load', function() {
      if ('performance' in window && 'timing' in performance) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log('Report loaded in', loadTime, 'ms');

        // Log statistics for debugging
        console.log('Report statistics:', {
          totalFindings: ${results.length},
          uniqueGroups: ${deduplicationGroups.length},
          duplicates: ${deduplicationStats.totalDuplicates},
          viewMode: window.ReportViewer ? window.ReportViewer.viewMode : 'unknown'
        });
      }
    });

    // Error handling
    window.addEventListener('error', function(event) {
      console.error('Report viewer error:', event.error);
    });

    // Unhandled promise rejection handling
    window.addEventListener('unhandledrejection', function(event) {
      console.error('Unhandled promise rejection in report viewer:', event.reason);
    });
  </script>
</body>
</html>`;
}

// Re-export types and utilities for convenience
export type { DeduplicationStats };
export { DeduplicationService } from "../../utils/deduplication";
export {
  generateFindingsSectionHtml,
  generateGroupHtml,
  generateFindingHtml,
  generateGroupedFindingsHtml,
  generateAllFindingsHtml,
} from "./findings";

export {
  generateSummaryHtml,
  generateReportHeaderHtml,
  generateReportMetadataHtml,
  generateDeduplicationSummaryHtml,
  generateSeverityCardsHtml,
  generateSeverityDistributionHtml,
} from "./summary";

export { getAllStyles, SEVERITY_COLORS, type SeverityLevel } from "./styles";

export { generateReportScripts, generateInlineHandlers } from "./scripts";
