/**
 * HTML generation utilities for report summary sections
 * Handles report metadata, deduplication stats, and severity distribution
 */

import { ReportSummary } from "../../types/report";
import { SEVERITY_COLORS, SeverityLevel } from "./styles";

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
 * Interface for deduplication statistics
 */
export interface DeduplicationStats {
  uniqueGroups: number;
  totalDuplicates: number;
  duplicatePercentage: string;
}

/**
 * Generates the main report header with title and timestamp
 */
export function generateReportHeaderHtml(
  summary: ReportSummary,
  formattedTimestamp?: string,
): string {
  return `
    <div class="text-center mb-12 animate-fade-in">
      <div class="flex items-center justify-center mb-6">
        <div class="flex items-center space-x-3">
          <svg class="h-12 w-12 text-blue-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
          <h1 class="text-4xl font-bold text-white">Security Report Viewer</h1>
        </div>
      </div>

      <p class="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
        Comprehensive security analysis report generated from ${summary.format ? escapeHtml(summary.format.toUpperCase()) : "security scan"} data
        with detailed findings, severity breakdowns, and actionable insights.
      </p>

      ${
        formattedTimestamp
          ? `
        <div class="flex items-center justify-center mt-6">
          <span class="inline-flex items-center px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-slate-300 text-sm font-medium shadow-lg backdrop-blur-sm">
            <svg class="h-4 w-4 mr-2 text-blue-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4l2 2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Report generated: ${escapeHtml(formattedTimestamp)}
          </span>
        </div>
      `
          : ""
      }
    </div>
  `;
}

/**
 * Generates the basic report metadata card
 */
export function generateReportMetadataHtml(summary: ReportSummary): string {
  return `
    <div class="card animate-fade-in">
      <div class="flex items-center space-x-3 mb-6">
        <svg class="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
        <h2 class="text-2xl font-bold text-white">Security Analysis Report</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div class="flex flex-col space-y-1">
          <span class="text-slate-400 font-medium">Tool:</span>
          <span class="text-white font-semibold">
            ${escapeHtml(summary.toolName)}${summary.toolVersion ? ` v${escapeHtml(summary.toolVersion)}` : ""}
          </span>
        </div>

        <div class="flex flex-col space-y-1">
          <span class="text-slate-400 font-medium">Total Findings:</span>
          <span class="text-white font-semibold text-lg">${summary.totalFindings}</span>
        </div>

        <div class="flex flex-col space-y-1">
          <span class="text-slate-400 font-medium">Files Affected:</span>
          <span class="text-white font-semibold text-lg">${summary.filesAffected}</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Generates the deduplication summary card
 */
export function generateDeduplicationSummaryHtml(
  stats: DeduplicationStats,
): string {
  if (stats.totalDuplicates === 0) return "";

  return `
    <div class="card animate-fade-in">
      <div class="flex items-center space-x-3 mb-6">
        <svg class="h-5 w-5 text-purple-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
        </svg>
        <h3 class="text-lg font-semibold text-white">Deduplication Summary</h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div class="flex flex-col space-y-1">
          <span class="text-slate-400 font-medium">Unique Issue Groups:</span>
          <span class="text-white font-semibold text-lg">${stats.uniqueGroups}</span>
        </div>

        <div class="flex flex-col space-y-1">
          <span class="text-slate-400 font-medium">Duplicate Findings:</span>
          <span class="text-orange-300 font-semibold text-lg">${stats.totalDuplicates}</span>
        </div>

        <div class="flex flex-col space-y-1">
          <span class="text-slate-400 font-medium">Duplication Rate:</span>
          <span class="text-orange-300 font-semibold text-lg">${stats.duplicatePercentage}%</span>
        </div>
      </div>

      <div class="mt-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
        <p class="text-xs text-slate-300 leading-relaxed">
          <svg class="h-4 w-4 text-purple-400 inline mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Similar issues have been automatically grouped to reduce noise in the report.
          Use the toggle above to switch between grouped and individual views.
        </p>
      </div>
    </div>
  `;
}

/**
 * Generates severity distribution cards
 */
export function generateSeverityCardsHtml(summary: ReportSummary): string {
  const severities: Array<{ key: SeverityLevel; label: string; icon: string }> =
    [
      {
        key: "critical",
        label: "Critical",
        icon: `<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
      </svg>`,
      },
      {
        key: "high",
        label: "High",
        icon: `<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"/>
      </svg>`,
      },
      {
        key: "medium",
        label: "Medium",
        icon: `<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>`,
      },
      {
        key: "low",
        label: "Low",
        icon: `<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>`,
      },
      {
        key: "info",
        label: "Info",
        icon: `<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>`,
      },
    ];

  return `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 animate-fade-in">
      ${severities
        .map(({ key, label, icon }) => {
          const count =
            (summary.severityCounts && summary.severityCounts[key]) || 0;
          const colors = SEVERITY_COLORS[key];
          const percentage =
            summary.totalFindings > 0
              ? ((count / summary.totalFindings) * 100).toFixed(1)
              : "0";

          return `
          <div class="card transition-all hover:scale-105 cursor-default"
               style="background-color: ${colors.bg}; border-color: ${colors.border};">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-2">
                <div style="color: ${colors.icon};">
                  ${icon}
                </div>
                <h3 class="font-medium" style="color: ${colors.text};">${label}</h3>
              </div>
            </div>

            <div class="space-y-1">
              <div class="text-2xl font-bold text-white">${count}</div>
              <div class="text-xs text-slate-400">${percentage}% of total</div>
            </div>
          </div>
        `;
        })
        .join("")}
    </div>
  `;
}

/**
 * Generates severity distribution bar chart
 */
export function generateSeverityDistributionHtml(
  summary: ReportSummary,
): string {
  if (summary.totalFindings === 0) {
    return `
      <div class="card animate-fade-in">
        <h3 class="text-lg font-semibold text-white mb-4">Severity Distribution</h3>
        <div class="text-center py-8">
          <div class="text-slate-400 mb-2">No findings to display</div>
          <div class="w-full bg-slate-700/50 rounded-full h-3"></div>
        </div>
      </div>
    `;
  }

  const severities: SeverityLevel[] = [
    "critical",
    "high",
    "medium",
    "low",
    "info",
  ];
  const segments = severities
    .map((severity) => {
      const count =
        (summary.severityCounts && summary.severityCounts[severity]) || 0;
      const percentage = (count / summary.totalFindings) * 100;
      const colors = SEVERITY_COLORS[severity];

      return {
        severity,
        count,
        percentage,
        color: colors.icon,
      };
    })
    .filter((segment) => segment.count > 0);

  const distributionBar = segments
    .map(
      (segment) =>
        `<div class="h-full transition-all"
          style="width: ${segment.percentage}%; background-color: ${segment.color};"
          title="${segment.severity}: ${segment.count} (${segment.percentage.toFixed(1)}%)"></div>`,
    )
    .join("");

  return `
    <div class="card animate-fade-in">
      <h3 class="text-lg font-semibold text-white mb-6">Severity Distribution</h3>

      <div class="w-full bg-slate-700/50 rounded-full h-4 overflow-hidden mb-4 shadow-inner">
        <div class="h-full flex transition-all">
          ${distributionBar}
        </div>
      </div>

      <div class="flex justify-between text-xs text-slate-400 mb-4">
        <span>0</span>
        <span>${summary.totalFindings} total findings</span>
      </div>

      <!-- Legend -->
      <div class="flex flex-wrap gap-4 text-xs">
        ${segments
          .map(
            (segment) => `
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full" style="background-color: ${segment.color};"></div>
            <span class="text-slate-300">
              ${segment.severity.charAt(0).toUpperCase() + segment.severity.slice(1)}:
              <span class="font-semibold">${segment.count}</span>
            </span>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>
  `;
}

/**
 * Generates the complete summary section HTML
 */
export function generateSummaryHtml(
  summary: ReportSummary,
  deduplicationStats?: DeduplicationStats,
  formattedTimestamp?: string,
): string {
  return `
    <div class="container mx-auto px-4 py-8">
      ${generateReportHeaderHtml(summary, formattedTimestamp)}

      <div class="space-y-8 max-w-6xl mx-auto">
        ${generateReportMetadataHtml(summary)}

        ${deduplicationStats ? generateDeduplicationSummaryHtml(deduplicationStats) : ""}

        ${generateSeverityCardsHtml(summary)}

        ${generateSeverityDistributionHtml(summary)}
      </div>
    </div>
  `;
}
