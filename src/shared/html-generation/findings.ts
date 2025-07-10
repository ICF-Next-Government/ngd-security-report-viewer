/**
 * HTML generation utilities for security findings
 * Handles both individual findings and grouped findings rendering
 */

import { ProcessedResult } from "../../types/report";
import {
  DeduplicationService,
  DuplicateGroup,
} from "../../utils/deduplication";
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
 * Generates SVG icon for severity levels
 */
function getSeverityIcon(severity: string): string {
  switch (severity) {
    case "critical":
    case "high":
      return `<svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
      </svg>`;
    case "medium":
      return `<svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>`;
    case "low":
    case "info":
    default:
      return `<svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
      </svg>`;
  }
}

/**
 * Generates HTML for file location icon
 */
function getFileIcon(): string {
  return `<svg class="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
  </svg>`;
}

/**
 * Generates HTML for chevron icon (expand/collapse)
 */
function getChevronIcon(): string {
  return `<svg class="h-5 w-5 text-slate-400 transition-transform chevron" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
  </svg>`;
}

/**
 * Generates HTML for tags display
 */
function generateTagsHtml(tags: string[]): string {
  if (!tags || tags.length === 0) return "";

  return `
    <div class="flex flex-wrap gap-2 mt-4">
      ${tags
        .map(
          (tag) => `
        <span class="inline-flex px-2 py-1 text-xs bg-slate-700/50 text-slate-300 rounded border border-slate-600">
          ${escapeHtml(tag)}
        </span>
      `,
        )
        .join("")}
    </div>
  `;
}

/**
 * Generates HTML for code snippet display
 */
function generateSnippetHtml(snippet?: string): string {
  if (!snippet) return "";

  return `
    <div class="mt-4">
      <h4 class="font-medium text-white mb-3">Code Snippet</h4>
      <pre class="bg-slate-900/80 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto border border-slate-700"><code>${escapeHtml(snippet)}</code></pre>
    </div>
  `;
}

/**
 * Generates HTML for group locations
 */
function generateGroupLocationsHtml(group: DuplicateGroup): string {
  const locations = DeduplicationService.getGroupLocations(group);

  if (locations.length === 0) return "";

  return `
    <div class="group-locations">
      <h4 class="font-medium text-white mb-3">All Occurrences (${group.occurrences})</h4>
      ${locations
        .map(
          (location) => `
        <div class="location-item">
          ${getFileIcon()}
          <span>${escapeHtml(location)}</span>
        </div>
      `,
        )
        .join("")}
    </div>
  `;
}

/**
 * Generates HTML for individual finding
 */
export function generateFindingHtml(result: ProcessedResult): string {
  const colors =
    SEVERITY_COLORS[result.severity as SeverityLevel] ?? SEVERITY_COLORS.info;

  return `
    <div class="finding-result card animate-fade-in transition-all hover:shadow-lg hover:scale-[1.01]"
         data-severity="${result.severity}"
         style="background-color: ${colors.bg}; border-color: ${colors.border};">
      <div class="flex items-start space-x-4">
        <div class="flex-shrink-0 mt-1" style="color: ${colors.icon};">
          ${getSeverityIcon(result.severity)}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-3 flex-wrap">
              <span class="inline-flex px-3 py-1 text-xs font-medium rounded-full border"
                    style="background-color: ${colors.badge}; color: ${colors.text}; border-color: ${colors.border};">
                ${result.severity.toUpperCase()}
              </span>
              <span class="text-sm text-slate-400 font-mono">${escapeHtml(result.ruleId)}</span>
            </div>
          </div>

          <h3 class="text-xl font-semibold text-white mb-2">${escapeHtml(result.ruleName)}</h3>
          <p class="text-slate-300 mb-4 leading-relaxed">${escapeHtml(result.message)}</p>

          <div class="text-sm text-slate-400 space-y-2">
            <div class="flex items-center space-x-2">
              ${getFileIcon()}
              <span class="font-mono">${escapeHtml(result.file)}${result.startLine ? `:${result.startLine}` : ""}</span>
            </div>

            ${
              result.description
                ? `
            <div class="mt-4">
              <h4 class="font-medium text-white mb-2">Description</h4>
              <p class="text-slate-300 text-sm leading-relaxed">${escapeHtml(result.description)}</p>
            </div>
            `
                : ""
            }

            ${generateSnippetHtml(result.snippet)}
            ${generateTagsHtml(result.tags)}
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Generates HTML for a duplicate group
 */
export function generateGroupHtml(group: DuplicateGroup): string {
  const result = group.representativeResult;
  const colors =
    SEVERITY_COLORS[result.severity as SeverityLevel] ?? SEVERITY_COLORS.info;
  const groupLocationsHtml = generateGroupLocationsHtml(group);

  return `
    <div class="finding-result card animate-fade-in group-toggle transition-all hover:shadow-lg hover:scale-[1.01]"
         data-severity="${result.severity}"
         data-group-id="${group.id}"
         style="background-color: ${colors.bg}; border-color: ${colors.border};"
         role="button"
         tabindex="0"
         aria-expanded="false">
      <div class="flex items-start space-x-4">
        <div class="flex-shrink-0 mt-1" style="color: ${colors.icon};">
          ${getSeverityIcon(result.severity)}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-3 flex-wrap">
              <span class="inline-flex px-3 py-1 text-xs font-medium rounded-full border"
                    style="background-color: ${colors.badge}; color: ${colors.text}; border-color: ${colors.border};">
                ${result.severity.toUpperCase()}
              </span>
              <span class="text-sm text-slate-400 font-mono">${escapeHtml(result.ruleId)}</span>
              ${
                group.occurrences > 1
                  ? `
                <span class="duplicate-badge">
                  ${group.occurrences} occurrences
                </span>
              `
                  : ""
              }
            </div>
            ${getChevronIcon()}
          </div>

          <h3 class="text-xl font-semibold text-white mb-2">${escapeHtml(result.ruleName)}</h3>
          <p class="text-slate-300 mb-4 leading-relaxed">${escapeHtml(result.message)}</p>

          <div class="text-sm text-slate-400">
            <p class="mb-2">${DeduplicationService.getGroupSummary(group)}</p>
            ${
              group.affectedFiles.length <= 3
                ? `
              <div class="flex items-center space-x-2">
                ${getFileIcon()}
                <span class="font-mono">${group.affectedFiles.map((file) => escapeHtml(file)).join(", ")}</span>
              </div>
            `
                : ""
            }
          </div>

          ${generateTagsHtml(result.tags)}
        </div>
      </div>

      <!-- Expandable group details -->
      <div id="group-details-${group.id}" style="display: none;" class="animate-slide-down">
        ${
          result.description || groupLocationsHtml
            ? `
          <div class="mt-6 pt-6 border-t border-slate-600">
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

            ${groupLocationsHtml}

            ${generateSnippetHtml(result.snippet)}
          </div>
        `
            : ""
        }
      </div>
    </div>
  `;
}

/**
 * Generates HTML for all grouped findings
 */
export function generateGroupedFindingsHtml(groups: DuplicateGroup[]): string {
  if (groups.length === 0) {
    return `
      <div class="card text-center shadow-lg">
        <svg class="h-12 w-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65" stroke-linecap="round"/>
          <line x1="8" y1="8" x2="16" y2="16" stroke-linecap="round"/>
        </svg>
        <h3 class="text-lg font-medium text-white mb-2">No grouped findings found</h3>
        <p class="text-slate-400">All findings are unique or filters excluded all results.</p>
      </div>
    `;
  }

  return `
    <div class="space-y-6">
      ${groups.map((group) => generateGroupHtml(group)).join("\n")}
    </div>
  `;
}

/**
 * Generates HTML for all individual findings (ungrouped view)
 */
export function generateAllFindingsHtml(results: ProcessedResult[]): string {
  if (results.length === 0) {
    return `
      <div class="card text-center shadow-lg">
        <svg class="h-12 w-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65" stroke-linecap="round"/>
          <line x1="8" y1="8" x2="16" y2="16" stroke-linecap="round"/>
        </svg>
        <h3 class="text-lg font-medium text-white mb-2">No findings found</h3>
        <p class="text-slate-400">This report contains no security findings or all were filtered out.</p>
      </div>
    `;
  }

  return `
    <div class="space-y-6">
      ${results.map((result) => generateFindingHtml(result)).join("\n")}
    </div>
  `;
}

/**
 * Generates the complete findings section with view toggle
 */
export function generateFindingsSectionHtml(
  results: ProcessedResult[],
  groups: DuplicateGroup[],
  enableDeduplication: boolean = true,
  showDeduplicationToggle: boolean = true,
): string {
  const hasGroups = groups.length > 0 && groups.length < results.length;

  return `
    <div class="space-y-8">
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center gap-3">
          <h2 class="text-2xl font-bold text-white">Security Findings</h2>
          <span class="text-slate-400 text-sm">
            ${enableDeduplication && hasGroups ? `${groups.length} groups` : `${results.length} findings`}
          </span>
        </div>

        ${
          showDeduplicationToggle && hasGroups
            ? `
          <div class="view-toggle">
            <button id="grouped-view-btn" class="${enableDeduplication ? "active" : ""}" type="button">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
              Grouped View
            </button>
            <button id="all-view-btn" class="${!enableDeduplication ? "active" : ""}" type="button">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
              All Findings
            </button>
          </div>
        `
            : ""
        }
      </div>

      <!-- Search and Filter Controls -->
      <div class="search-container">
        <div class="search-input-wrapper">
          <input
            type="text"
            id="inline-findings-search"
            class="search-input"
            placeholder="Search findings by message, file, or rule ID..."
            autocomplete="off"
          />
          <button
            type="button"
            id="inline-findings-clear"
            class="search-clear"
            style="display: none;"
            title="Clear search"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <select id="inline-severity-filter" class="severity-filter">
          <option value="all">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
          <option value="info">Info</option>
        </select>
      </div>

      <!-- Findings Content -->
      <div id="findings-list">
        <!-- Grouped Findings -->
        <div id="grouped-findings" style="display: ${enableDeduplication && hasGroups ? "block" : "none"};">
          ${generateGroupedFindingsHtml(groups)}
        </div>

        <!-- All Findings (Ungrouped) -->
        <div id="all-findings" style="display: ${!enableDeduplication || !hasGroups ? "block" : "none"};">
          ${generateAllFindingsHtml(results)}
        </div>
      </div>

      <!-- No Results Message -->
      <div id="inline-no-results" class="inline-no-results">
        <svg class="h-12 w-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65" stroke-linecap="round"/>
        </svg>
        <h3 class="text-lg font-medium text-white mb-2">No results found</h3>
        <p class="text-slate-400">Try adjusting your search criteria or filters.</p>
      </div>
    </div>
  `;
}
