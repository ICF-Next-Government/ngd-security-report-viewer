/**
 * Complete static HTML export that exactly replicates the React application
 * This creates a self-contained HTML file with all assets embedded for offline use
 */

import { ProcessedResult, ReportSummary } from "../../types/report";
import {
  DeduplicationService,
  DuplicateGroup,
} from "../../utils/deduplication";

export interface GenerateStaticHtmlOptions {
  summary: ReportSummary;
  results: ProcessedResult[];
  generatedAt?: string;
  enableDeduplication?: boolean;
}

/**
 * Generates a complete static HTML file that exactly replicates the React application
 */
export function generateStaticHtml({
  summary,
  results,
  generatedAt,
  enableDeduplication = true,
}: GenerateStaticHtmlOptions): string {
  // Calculate deduplication stats
  const groups = DeduplicationService.deduplicateFindings(results);
  const totalDuplicates = results.length - groups.length;
  const duplicatePercentage =
    results.length > 0
      ? ((totalDuplicates / results.length) * 100).toFixed(1)
      : "0";

  const hasDeduplication = totalDuplicates > 0;
  const showDeduplication = enableDeduplication && hasDeduplication;

  // Format timestamp
  const formattedTimestamp = generatedAt
    ? new Date(generatedAt).toLocaleString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : null;

  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Security Analysis Report - ${escapeHtml(summary.toolName)}</title>
  <style>
    ${getAllStyles()}
  </style>
</head>
<body class="min-h-screen bg-slate-900 antialiased">
  <!-- Main content -->
  <div id="report-content" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">

    ${formattedTimestamp ? generateTimestampBadge(formattedTimestamp) : ""}

    <!-- Report Summary -->
    <div class="space-y-8 animate-fade-in">
      ${generateReportHeader(summary)}
      ${hasDeduplication ? generateDeduplicationSummary(groups.length, totalDuplicates, duplicatePercentage) : ""}
      ${generateSeverityCards(summary)}
      ${generateSeverityDistribution(summary)}
    </div>

    <!-- Findings -->
    <div class="animate-fade-in" style="animation-delay: 0.3s">
      ${generateFindingsSection(results, groups, showDeduplication)}
    </div>
  </div>

  <script>
    ${getAllScripts()}
  </script>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function generateTimestampBadge(timestamp: string): string {
  return `
    <div class="flex justify-center mb-6">
      <span class="inline-flex items-center px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-slate-300 text-xs font-medium shadow">
        <svg class="h-4 w-4 mr-1 text-blue-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 8v4l2 2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Report generated: ${escapeHtml(timestamp)}
      </span>
    </div>
  `;
}

function generateReportHeader(summary: ReportSummary): string {
  return `
    <div class="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6 shadow-lg">
      <div class="flex items-center space-x-3 mb-4">
        <svg class="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
        </svg>
        <h2 class="text-2xl font-bold text-white">Security Analysis Report</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <span class="text-slate-400">Tool:</span>
          <span class="ml-2 font-medium text-white">
            ${escapeHtml(summary.toolName)}${summary.toolVersion ? ` v${escapeHtml(summary.toolVersion)}` : ""}
          </span>
        </div>
        <div>
          <span class="text-slate-400">Total Findings:</span>
          <span class="ml-2 font-medium text-white">${summary.totalFindings}</span>
        </div>
        <div>
          <span class="text-slate-400">Files Affected:</span>
          <span class="ml-2 font-medium text-white">${summary.filesAffected}</span>
        </div>
      </div>
    </div>
  `;
}

function generateDeduplicationSummary(
  uniqueGroups: number,
  totalDuplicates: number,
  percentage: string,
): string {
  return `
    <div class="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6 shadow-lg">
      <div class="flex items-center space-x-3 mb-4">
        <svg class="h-5 w-5 text-purple-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
        </svg>
        <h3 class="text-lg font-semibold text-white">Deduplication Summary</h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <span class="text-slate-400">Unique Issue Groups:</span>
          <span class="ml-2 font-medium text-white">${uniqueGroups}</span>
        </div>
        <div>
          <span class="text-slate-400">Duplicate Findings:</span>
          <span class="ml-2 font-medium text-orange-300">${totalDuplicates}</span>
        </div>
        <div>
          <span class="text-slate-400">Duplication Rate:</span>
          <span class="ml-2 font-medium text-orange-300">${percentage}%</span>
        </div>
      </div>

      <p class="text-xs text-slate-400 mt-4">
        Similar issues have been automatically grouped to reduce noise in the report.
      </p>
    </div>
  `;
}

function generateSeverityCards(summary: ReportSummary): string {
  const severities = [
    {
      key: "critical",
      label: "Critical",
      color: "bg-red-500",
      bgColor: "bg-red-900/20",
      textColor: "text-red-300",
      borderColor: "border-red-700",
      icon: "triangle",
    },
    {
      key: "high",
      label: "High",
      color: "bg-orange-500",
      bgColor: "bg-orange-900/20",
      textColor: "text-orange-300",
      borderColor: "border-orange-700",
      icon: "triangle",
    },
    {
      key: "medium",
      label: "Medium",
      color: "bg-amber-500",
      bgColor: "bg-amber-900/20",
      textColor: "text-amber-300",
      borderColor: "border-amber-700",
      icon: "info",
    },
    {
      key: "low",
      label: "Low",
      color: "bg-blue-500",
      bgColor: "bg-blue-900/20",
      textColor: "text-blue-300",
      borderColor: "border-blue-700",
      icon: "info",
    },
    {
      key: "info",
      label: "Info",
      color: "bg-slate-500",
      bgColor: "bg-slate-800/50",
      textColor: "text-slate-300",
      borderColor: "border-slate-600",
      icon: "check",
    },
  ];

  return `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      ${severities
        .map((sev) => {
          const count =
            summary.severityCounts?.[
              sev.key as keyof typeof summary.severityCounts
            ] || 0;
          const icon =
            sev.icon === "triangle"
              ? '<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>'
              : sev.icon === "info"
                ? '<path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>'
                : '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>';

          return `
          <div class="${sev.bgColor} ${sev.borderColor} backdrop-blur-sm rounded-lg border p-6 transition-all hover:scale-105 hover:shadow-lg">
            <div class="flex items-center justify-between mb-3">
              <svg class="h-5 w-5 ${sev.textColor}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                ${icon}
              </svg>
              ${count > 0 ? `<div class="w-3 h-3 rounded-full ${sev.color}"></div>` : ""}
            </div>
            <div class="space-y-1">
              <p class="text-2xl font-bold text-white">${count}</p>
              <p class="text-sm font-medium ${sev.textColor}">${sev.label}</p>
            </div>
          </div>
        `;
        })
        .join("")}
    </div>
  `;
}

function generateSeverityDistribution(summary: ReportSummary): string {
  const severities = [
    { key: "critical", color: "bg-red-500" },
    { key: "high", color: "bg-orange-500" },
    { key: "medium", color: "bg-amber-500" },
    { key: "low", color: "bg-blue-500" },
    { key: "info", color: "bg-slate-500" },
  ];

  const bars = severities
    .map((sev) => {
      const count =
        summary.severityCounts?.[
          sev.key as keyof typeof summary.severityCounts
        ] || 0;
      if (count > 0 && summary.totalFindings > 0) {
        const percentage = (count / summary.totalFindings) * 100;
        return `<div class="${sev.color}" style="width: ${percentage}%;" title="${sev.key}: ${count} (${percentage.toFixed(1)}%)"></div>`;
      }
      return "";
    })
    .join("");

  return `
    <div class="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6 shadow-lg">
      <h3 class="text-lg font-semibold text-white mb-4">Severity Distribution</h3>
      <div class="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
        <div class="h-full flex">
          ${bars}
        </div>
      </div>
      <div class="flex justify-between text-xs text-slate-400 mt-2">
        <span>0</span>
        <span>${summary.totalFindings} total findings</span>
      </div>
    </div>
  `;
}

function generateFindingsSection(
  results: ProcessedResult[],
  groups: DuplicateGroup[],
  showDeduplication: boolean,
): string {
  const hasGroups = groups.length > 0 && groups.length < results.length;

  return `
    <div class="space-y-8">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-white">Security Findings</h2>
        <div class="flex items-center gap-4">
          ${
            hasGroups
              ? `
          <div class="flex bg-slate-700/50 rounded-lg p-1">
            <button
              id="grouped-view-btn"
              class="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                showDeduplication
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white"
              }"
              type="button"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
              Grouped
            </button>
            <button
              id="all-view-btn"
              class="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                !showDeduplication
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white"
              }"
              type="button"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
              All
            </button>
          </div>
          `
              : ""
          }
          <span class="text-slate-400">
            ${showDeduplication && hasGroups ? `${groups.length} groups` : `${results.length} findings`}
          </span>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6 shadow-lg">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <div class="relative">
              <svg class="absolute left-3 h-5 w-5 text-slate-400" style="top: 50%; transform: translateY(-50%);" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input type="text" id="search-input" placeholder="Search findings, files, or rule IDs..."
                class="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-400">
            </div>
          </div>

          <div class="relative">
            <svg class="absolute left-3 h-5 w-5 text-slate-400" style="top: 50%; transform: translateY(-50%);" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
            </svg>
            <select id="severity-filter" class="pl-12 pr-10 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none text-white">
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
              <option value="info">Info</option>
            </select>
            <svg class="absolute right-3 h-5 w-5 text-slate-400 pointer-events-none" style="top: 50%; transform: translateY(-50%);" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
        </div>

        <div class="mt-4 text-sm text-slate-400">
          Showing <span id="filtered-count">${showDeduplication && hasGroups ? groups.length : results.length}</span> of ${results.length} findings
        </div>
      </div>

      <!-- Findings List -->
      <div id="findings-container" class="space-y-6">
        <div id="grouped-findings" style="${showDeduplication ? "" : "display: none;"}">
          ${generateGroupedFindings(groups)}
        </div>
        <div id="all-findings" style="${showDeduplication ? "display: none;" : ""}">
          ${generateAllFindings(results)}
        </div>
      </div>

      <!-- No results message -->
      <div id="no-results" class="text-center py-12 text-slate-400 hidden">
        <svg class="h-12 w-12 mx-auto mb-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p class="text-lg font-medium">No findings match your search criteria</p>
        <p class="text-sm mt-2">Try adjusting your filters or search terms</p>
      </div>
    </div>
  `;
}

function generateGroupedFindings(groups: DuplicateGroup[]): string {
  return `<div class="space-y-6">${groups.map((group) => generateGroupCard(group)).join("")}</div>`;
}

function generateAllFindings(results: ProcessedResult[]): string {
  return `<div class="space-y-6">${results.map((result) => generateFindingCard(result)).join("")}</div>`;
}

function generateGroupCard(group: DuplicateGroup): string {
  const result = group.representativeResult;
  const colors = getSeverityColors(result.severity);

  return `
    <div class="finding-card group-card ${colors.bg} ${colors.border} backdrop-blur-sm border rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.01]"
         data-severity="${result.severity}" data-group-id="${group.id}">
      <div class="flex items-start space-x-4">
        <svg class="h-6 w-6 ${colors.icon} mt-1 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          ${getSeverityIcon(result.severity)}
        </svg>

        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-3">
              <span class="inline-flex px-3 py-1 text-xs font-medium rounded-full ${colors.badge} border">
                ${result.severity.toUpperCase()}
              </span>
              <span class="text-sm text-slate-400">${escapeHtml(result.ruleId)}</span>
              ${
                group.occurrences > 1
                  ? `
                <span class="inline-flex px-2 py-1 text-xs font-medium bg-slate-700/50 text-slate-300 rounded-full border border-slate-600">
                  ${group.occurrences} occurrences
                </span>
              `
                  : ""
              }
            </div>
            <svg class="h-5 w-5 text-slate-400 transition-transform chevron" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>

          <h3 class="text-xl font-semibold text-white mb-2">${escapeHtml(result.ruleName)}</h3>
          <p class="text-slate-300 mb-4 leading-relaxed">${escapeHtml(result.message)}</p>

          <div class="text-sm text-slate-400">
            <p class="mb-2">${DeduplicationService.getGroupSummary(group)}</p>
            ${
              group.affectedFiles.length <= 3
                ? `
              <div class="flex items-center space-x-2">
                <svg class="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <span class="font-mono">${group.affectedFiles.map((f) => escapeHtml(f)).join(", ")}</span>
              </div>
            `
                : ""
            }
          </div>

          <div class="expanded-content hidden mt-6 pt-6 border-t border-slate-600">
            ${
              result.description
                ? `
              <div class="mb-6">
                <h4 class="font-medium text-white mb-3">Description</h4>
                <p class="text-slate-300 text-sm leading-relaxed">${escapeHtml(result.description)}</p>
              </div>
            `
                : ""
            }

            <div class="mb-6">
              <h4 class="font-medium text-white mb-3">All Occurrences</h4>
              <div class="space-y-2">
                ${DeduplicationService.getGroupLocations(group)
                  .map(
                    (location) => `
                  <div class="flex items-center space-x-2 text-sm text-slate-400">
                    <svg class="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    <span class="font-mono">${escapeHtml(location)}</span>
                  </div>
                `,
                  )
                  .join("")}
              </div>
            </div>

            ${
              result.snippet
                ? `
              <div>
                <h4 class="font-medium text-white mb-3">Code Snippet (from first occurrence)</h4>
                <pre class="bg-slate-900/80 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto border border-slate-700"><code>${escapeHtml(result.snippet)}</code></pre>
              </div>
            `
                : ""
            }
          </div>
        </div>
      </div>
    </div>
  `;
}

function generateFindingCard(result: ProcessedResult): string {
  const colors = getSeverityColors(result.severity);

  return `
    <div class="finding-card ${colors.bg} ${colors.border} backdrop-blur-sm border rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.01]"
         data-severity="${result.severity}">
      <div class="flex items-start space-x-4">
        <svg class="h-6 w-6 ${colors.icon} mt-1 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          ${getSeverityIcon(result.severity)}
        </svg>

        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-3">
              <span class="inline-flex px-3 py-1 text-xs font-medium rounded-full ${colors.badge} border">
                ${result.severity.toUpperCase()}
              </span>
              <span class="text-sm text-slate-400">${escapeHtml(result.ruleId)}</span>
            </div>
            <svg class="h-5 w-5 text-slate-400 transition-transform chevron" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>

          <h3 class="text-xl font-semibold text-white mb-2">${escapeHtml(result.ruleName)}</h3>
          <p class="text-slate-300 mb-4 leading-relaxed">${escapeHtml(result.message)}</p>

          <div class="flex items-center space-x-6 text-sm text-slate-400">
            <div class="flex items-center space-x-2">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <span>${escapeHtml(result.file)}</span>
            </div>
            ${
              result.startLine
                ? `
              <span>Line ${result.startLine}${result.endLine && result.endLine !== result.startLine ? `-${result.endLine}` : ""}</span>
            `
                : ""
            }
          </div>

          ${
            result.tags && result.tags.length > 0
              ? `
            <div class="flex flex-wrap gap-2 mt-4">
              ${result.tags
                .map(
                  (tag) => `
                <span class="inline-flex px-2 py-1 text-xs bg-slate-700/50 text-slate-300 rounded border border-slate-600">
                  ${escapeHtml(tag)}
                </span>
              `,
                )
                .join("")}
            </div>
          `
              : ""
          }

          <div class="expanded-content hidden mt-6 pt-6 border-t border-slate-600">
            ${
              result.description
                ? `
              <div class="mb-6">
                <h4 class="font-medium text-white mb-3">Description</h4>
                <p class="text-slate-300 text-sm leading-relaxed">${escapeHtml(result.description)}</p>
              </div>
            `
                : ""
            }

            ${
              result.snippet
                ? `
              <div>
                <h4 class="font-medium text-white mb-3">Code Snippet</h4>
                <pre class="bg-slate-900/80 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto border border-slate-700"><code>${escapeHtml(result.snippet)}</code></pre>
              </div>
            `
                : ""
            }
          </div>
        </div>
      </div>
    </div>
  `;
}

function getSeverityColors(severity: string) {
  const colors = {
    critical: {
      bg: "bg-red-900/20",
      text: "text-red-300",
      border: "border-red-700",
      icon: "text-red-400",
      badge: "bg-red-900/40 text-red-300 border-red-700",
    },
    high: {
      bg: "bg-orange-900/20",
      text: "text-orange-300",
      border: "border-orange-700",
      icon: "text-orange-400",
      badge: "bg-orange-900/40 text-orange-300 border-orange-700",
    },
    medium: {
      bg: "bg-amber-900/20",
      text: "text-amber-300",
      border: "border-amber-700",
      icon: "text-amber-400",
      badge: "bg-amber-900/40 text-amber-300 border-amber-700",
    },
    low: {
      bg: "bg-blue-900/20",
      text: "text-blue-300",
      border: "border-blue-700",
      icon: "text-blue-400",
      badge: "bg-blue-900/40 text-blue-300 border-blue-700",
    },
    info: {
      bg: "bg-slate-800/50",
      text: "text-slate-300",
      border: "border-slate-600",
      icon: "text-slate-400",
      badge: "bg-slate-700/50 text-slate-300 border-slate-600",
    },
  };

  return colors[severity as keyof typeof colors] || colors.info;
}

function getSeverityIcon(severity: string): string {
  switch (severity) {
    case "critical":
    case "high":
      return '<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>';
    case "medium":
      return '<path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>';
    case "low":
    case "info":
    default:
      return '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>';
  }
}

function getAllStyles(): string {
  return `
    /* Base Tailwind CSS reset and utilities */
    *, ::before, ::after {
      box-sizing: border-box;
      border-width: 0;
      border-style: solid;
      border-color: #e5e7eb;
    }

    html {
      line-height: 1.5;
      -webkit-text-size-adjust: 100%;
      -moz-tab-size: 4;
      -o-tab-size: 4;
      tab-size: 4;
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
      font-feature-settings: normal;
    }

    body {
      margin: 0;
      line-height: inherit;
      background: #0f172a;
      color: #e2e8f0;
    }

    /* Tailwind utility classes used in the app */
    .container { width: 100%; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .my-2 { margin-top: 0.5rem; margin-bottom: 0.5rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-3 { margin-bottom: 0.75rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mb-6 { margin-bottom: 1.5rem; }
    .ml-2 { margin-left: 0.5rem; }
    .mr-1 { margin-right: 0.25rem; }
    .mt-1 { margin-top: 0.25rem; }
    .mt-2 { margin-top: 0.5rem; }
    .mt-4 { margin-top: 1rem; }
    .mt-6 { margin-top: 1.5rem; }
    .block { display: block; }
    .inline-block { display: inline-block; }
    .inline { display: inline; }
    .flex { display: flex; }
    .inline-flex { display: inline-flex; }
    .grid { display: grid; }
    .hidden { display: none; }
    .h-3 { height: 0.75rem; }
    .h-4 { height: 1rem; }
    .h-5 { height: 1.25rem; }
    .h-6 { height: 1.5rem; }
    .h-12 { height: 3rem; }
    .h-full { height: 100%; }
    .w-3 { width: 0.75rem; }
    .w-4 { width: 1rem; }
    .w-5 { width: 1.25rem; }
    .w-6 { width: 1.5rem; }
    .w-12 { width: 3rem; }
    .w-full { width: 100%; }
    .max-w-7xl { max-width: 80rem; }
    .max-w-xs { max-width: 20rem; }
    .flex-1 { flex: 1 1 0%; }
    .flex-shrink-0 { flex-shrink: 0; }
    .transform { transform: translateX(var(--tw-translate-x, 0)) translateY(var(--tw-translate-y, 0)) rotate(var(--tw-rotate, 0)) skewX(var(--tw-skew-x, 0)) skewY(var(--tw-skew-y, 0)) scaleX(var(--tw-scale-x, 1)) scaleY(var(--tw-scale-y, 1)); }
    .-translate-x-1\/2 { --tw-translate-x: -50%; }
    .-translate-y-1\/2 { --tw-translate-y: -50%; }
    .rotate-180 { --tw-rotate: 180deg; }
    .cursor-pointer { cursor: pointer; }
    .appearance-none { -webkit-appearance: none; -moz-appearance: none; appearance: none; }
    .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
    .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .grid-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
    .flex-col { flex-direction: column; }
    .flex-row { flex-direction: row; }
    .flex-wrap { flex-wrap: wrap; }
    .items-start { align-items: flex-start; }
    .items-center { align-items: center; }
    .justify-center { justify-content: center; }
    .justify-between { justify-content: space-between; }
    .gap-2 { gap: 0.5rem; }
    .gap-3 { gap: 0.75rem; }
    .gap-4 { gap: 1rem; }
    .rounded-md { border-radius: 0.375rem; }
    .space-x-2 > * + * { margin-left: 0.5rem; }
    .space-x-3 > * + * { margin-left: 0.75rem; }
    .space-x-4 > * + * { margin-left: 1rem; }
    .space-x-6 > * + * { margin-left: 1.5rem; }
    .space-y-1 > * + * { margin-top: 0.25rem; }
    .space-y-2 > * + * { margin-top: 0.5rem; }
    .space-y-4 > * + * { margin-top: 1rem; }
    .space-y-6 { display: flex; flex-direction: column; gap: 2rem; }
    .space-y-8 > * + * { margin-top: 2rem; }
    .overflow-hidden { overflow: hidden; }
    .overflow-x-auto { overflow-x: auto; }
    .rounded { border-radius: 0.25rem; }
    .rounded-lg { border-radius: 0.5rem; }
    .rounded-full { border-radius: 9999px; }
    .border { border-width: 1px; }
    .border-t { border-top-width: 1px; }
    .border-slate-600 { border-color: #475569; }
    .border-slate-700 { border-color: #334155; }
    .border-red-600 { border-color: #dc2626; }
    .border-red-700 { border-color: #b91c1c; }
    .border-orange-700 { border-color: #c2410c; }
    .border-amber-700 { border-color: #a16207; }
    .border-blue-700 { border-color: #1d4ed8; }
    .bg-slate-700 { background-color: #334155; }
    .bg-slate-700\\/50 { background-color: rgba(51, 65, 85, 0.5); }
    .bg-slate-800\\/50 { background-color: rgba(30, 41, 59, 0.5); }
    .bg-slate-900 { background-color: #0f172a; }
    .bg-slate-900\\/80 { background-color: rgba(15, 23, 42, 0.8); }
    .bg-red-500 { background-color: #ef4444; }
    .bg-red-900\\/20 { background-color: rgba(127, 29, 29, 0.2); }
    .bg-red-900\\/40 { background-color: rgba(127, 29, 29, 0.4); }
    .bg-orange-500 { background-color: #f97316; }
    .bg-orange-900\\/20 { background-color: rgba(124, 45, 18, 0.2); }
    .bg-orange-900\\/40 { background-color: rgba(124, 45, 18, 0.4); }
    .bg-amber-500 { background-color: #f59e0b; }
    .bg-amber-900\\/20 { background-color: rgba(120, 53, 15, 0.2); }
    .bg-amber-900\\/40 { background-color: rgba(120, 53, 15, 0.4); }
    .bg-blue-500 { background-color: #3b82f6; }
    .bg-blue-900\\/20 { background-color: rgba(30, 58, 138, 0.2); }
    .bg-blue-900\\/40 { background-color: rgba(30, 58, 138, 0.4); }
    .bg-slate-500 { background-color: #64748b; }
    .bg-blue-600 { background-color: #2563eb; }
    .p-1 { padding: 0.25rem; }
    .p-4 { padding: 1rem; }
    .p-6 { padding: 1.5rem; }
    .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
    .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
    .px-4 { padding-left: 1rem; padding-right: 1rem; }
    .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
    .py-1\\.5 { padding-top: 0.375rem; padding-bottom: 0.375rem; }
    .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
    .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
    .py-12 { padding-top: 3rem; padding-bottom: 3rem; }
    .pt-6 { padding-top: 1.5rem; }
    .pl-10 { padding-left: 2.5rem; }
    .pl-12 { padding-left: 3rem; }
    .pr-10 { padding-right: 2.5rem; }
    .pr-4 { padding-right: 1rem; }
    .pr-8 { padding-right: 2rem; }
    .text-center { text-align: center; }
    .text-2xl { font-size: 1.5rem; line-height: 2rem; }
    .text-xs { font-size: 0.75rem; line-height: 1rem; }
    .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
    .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
    .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
    .font-medium { font-weight: 500; }
    .font-semibold { font-weight: 600; }
    .font-bold { font-weight: 700; }
    .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
    .leading-relaxed { line-height: 1.625; }
    .text-white { color: #ffffff; }
    .text-slate-100 { color: #f1f5f9; }
    .text-slate-300 { color: #cbd5e1; }
    .text-slate-400 { color: #94a3b8; }
    .text-slate-600 { color: #475569; }
    .text-blue-400 { color: #60a5fa; }
    .text-red-300 { color: #fca5a5; }
    .text-red-400 { color: #f87171; }
    .text-orange-300 { color: #fdba74; }
    .text-orange-400 { color: #fb923c; }
    .text-amber-300 { color: #fcd34d; }
    .text-amber-400 { color: #fbbf24; }
    .text-blue-300 { color: #93c5fd; }
    .text-purple-400 { color: #c084fc; }
    .text-center { text-align: center; }
    .placeholder-slate-400::placeholder { color: #94a3b8; }
    .shadow { box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); }
    .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
    .backdrop-blur-sm { backdrop-filter: blur(4px); }
    .transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
    .transition-transform { transition-property: transform; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
    .min-h-screen { min-height: 100vh; }
    .antialiased { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
    .scroll-smooth { scroll-behavior: smooth; }
    .hover\:scale-105:hover { transform: scale(1.05); }
    .hover\:scale-\[1\.01\]:hover { transform: scale(1.01); }
    .hover\:shadow-lg:hover { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
    .hover\:text-white:hover { color: #ffffff; }
    .transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
    .focus\:ring-2:focus { box-shadow: 0 0 0 0px #fff, 0 0 0 2px #3b82f6, 0 0 #0000; }
    .focus\:ring-blue-500:focus { --tw-ring-color: #3b82f6; }
    .focus\:border-blue-500:focus { border-color: #3b82f6; }
    .pointer-events-none { pointer-events: none; }
    .relative { position: relative; }
    .absolute { position: absolute; }
    .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
    .top-1\/2 { top: 50%; }
    .top-0 { top: 0; }
    .bottom-0 { bottom: 0; }
    .left-3 { left: 0.75rem; }
    .right-3 { right: 0.75rem; }
    .min-w-0 { min-width: 0; }

    /* Responsive utilities */
    @media (min-width: 640px) {
      .sm\\:flex-row { flex-direction: row; }
      .sm\\:items-center { align-items: center; }
      .sm\\:justify-between { justify-content: space-between; }
      .sm\\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
      .sm\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }

    @media (min-width: 768px) {
      .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    }

    @media (min-width: 1024px) {
      .lg\\:px-8 { padding-left: 2rem; padding-right: 2rem; }
      .lg\\:grid-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
    }

    /* Custom component styles */
    input[type="text"],
    select {
      font-family: inherit;
      font-size: 100%;
      line-height: inherit;
      color: inherit;
      margin: 0;
    }

    pre {
      margin: 0;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      white-space: pre-wrap;
      word-break: break-word;
    }

    code {
      font-family: inherit;
    }

    button {
      font-family: inherit;
      font-size: inherit;
      font-weight: inherit;
      line-height: inherit;
      color: inherit;
      cursor: pointer;
      background: transparent;
      border: none;
      padding: 0;
      margin: 0;
    }

    .chevron {
      transition: transform 0.2s ease;
    }

    .expanded .chevron {
      transform: rotate(180deg);
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(16px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-fade-in {
      animation: fadeIn 0.7s ease-out;
    }

    .animate-fade-in[style*="animation-delay"] {
      opacity: 0;
      animation-fill-mode: forwards;
    }
  `;
}

function getAllScripts(): string {
  return `
    // View toggle functionality
    const groupedBtn = document.getElementById('grouped-view-btn');
    const allBtn = document.getElementById('all-view-btn');
    const groupedFindings = document.getElementById('grouped-findings');
    const allFindings = document.getElementById('all-findings');

    if (groupedBtn && allBtn && groupedFindings && allFindings) {
      groupedBtn.addEventListener('click', () => {
        groupedBtn.classList.add('bg-blue-600', 'text-white');
        groupedBtn.classList.remove('text-slate-400', 'hover:text-white');
        allBtn.classList.remove('bg-blue-600', 'text-white');
        allBtn.classList.add('text-slate-400', 'hover:text-white');
        groupedFindings.style.display = '';
        allFindings.style.display = 'none';
        filterFindings();
      });

      allBtn.addEventListener('click', () => {
        allBtn.classList.add('bg-blue-600', 'text-white');
        allBtn.classList.remove('text-slate-400', 'hover:text-white');
        groupedBtn.classList.remove('bg-blue-600', 'text-white');
        groupedBtn.classList.add('text-slate-400', 'hover:text-white');
        allFindings.style.display = '';
        groupedFindings.style.display = 'none';
        filterFindings();
      });
    }

    // Expandable cards
    document.querySelectorAll('.finding-card').forEach(card => {
      card.addEventListener('click', () => {
        const expandedContent = card.querySelector('.expanded-content');
        const chevron = card.querySelector('.chevron');

        if (expandedContent) {
          expandedContent.classList.toggle('hidden');
          card.classList.toggle('expanded');
        }
      });
    });

    // Search functionality
    const searchInput = document.getElementById('search-input');
    const severityFilter = document.getElementById('severity-filter');
    const noResults = document.getElementById('no-results');

    function filterFindings() {
      const searchTerm = searchInput.value.toLowerCase();
      const severity = severityFilter.value;
      const filteredCount = document.getElementById('filtered-count');

      let hasVisibleFindings = false;
      let visibleCount = 0;

      document.querySelectorAll('.finding-card').forEach(card => {
        const cardSeverity = card.dataset.severity;
        const cardText = card.textContent.toLowerCase();

        const matchesSeverity = severity === 'all' || cardSeverity === severity;
        const matchesSearch = !searchTerm || cardText.includes(searchTerm);

        if (matchesSeverity && matchesSearch) {
          card.style.display = '';
          hasVisibleFindings = true;
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      noResults.classList.toggle('hidden', hasVisibleFindings);
      if (filteredCount) {
        filteredCount.textContent = visibleCount;
      }
    }

    searchInput.addEventListener('input', filterFindings);
    severityFilter.addEventListener('change', filterFindings);
  `;
}
