/**
 * Shared HTML export logic for SARIF reports.
 * This function is used by both the CLI and the UI to ensure identical output.
 */

export interface Finding {
  severity: string;
  ruleId: string;
  ruleName: string;
  message: string;
  file: string;
  startLine?: number;
  endLine?: number;
  tags: string[];
  description?: string;
  snippet?: string;
}

export interface ReportSummary {
  toolName: string;
  toolVersion?: string;
  totalFindings: number;
  filesAffected: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  infoCount: number;
}

export interface GenerateHtmlOptions {
  summary: ReportSummary;
  results: Finding[];
  generatedAt?: string; // ISO string or formatted date
}

/**
 * Generates static HTML for a SARIF report.
 * @param options - The report summary, findings, and optional generated timestamp.
 * @returns HTML string
 */
export function generateHtml({
  summary,
  results,
  generatedAt,
}: GenerateHtmlOptions): string {
  // Use the same HTML as the UI export button
  const formattedTimestamp = generatedAt
    ? (() => {
        const date = new Date(generatedAt);
        // Format with time zone name
        return date.toLocaleString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZoneName: "short",
        });
      })()
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Security Analysis Report</title>
  <link href="https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.0/index.min.css" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com?plugins=typography"></script>
  <style>
    html { background: #0f172a; }
    body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; background: #0f172a; color: #f1f5f9; margin: 0; }
    .backdrop-blur-sm { backdrop-filter: blur(6px); }
    .shadow-lg { box-shadow: 0 10px 15px -3px rgb(15 23 42 / 0.3), 0 4px 6px -4px rgb(15 23 42 / 0.3); }
    .rounded-lg { border-radius: 0.75rem; }
    .rounded-xl { border-radius: 1rem; }
    .border { border-width: 1px; }
    .border-slate-700 { border-color: #334155; }
    /* --- Search/filter styles --- */
    .inline-search-bar {
      position: relative;
      width: 100%;
      margin-bottom: 2rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: rgba(51,65,85,0.5);
      border-radius: 0.5rem;
      border: 1.5px solid #334155;
      box-shadow: 0 2px 8px 0 rgba(30,41,59,0.10);
      padding: 0.5rem 0.5rem 0.5rem 0;
      flex-wrap: wrap;
    }
    .inline-search-bar input {
      flex: 1 1 220px;
      min-width: 0;
      padding: 0.75rem 2.5rem 0.75rem 2.5rem;
      background: transparent;
      border: none;
      color: #e0e7ef;
      font-size: 1rem;
      border-radius: 0.5rem;
      outline: none;
      transition: box-shadow 0.2s;
    }
    .inline-search-bar select {
      background: rgba(51,65,85,0.7);
      border: 1.5px solid #334155;
      color: #e0e7ef;
      border-radius: 0.5rem;
      font-size: 1rem;
      padding: 0.65rem 2.2rem 0.65rem 2.2rem;
      outline: none;
      min-width: 140px;
      margin-left: 0.25rem;
      margin-right: 0.25rem;
      appearance: none;
      box-shadow: 0 2px 8px 0 rgba(30,41,59,0.05);
      transition: border 0.2s;
    }
    .inline-search-bar select:focus {
      border-color: #3b82f6;
    }
    .inline-search-bar .inline-search-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      width: 1.1rem;
      height: 1.1rem;
      color: #94a3b8;
      pointer-events: none;
      opacity: 0.9;
      z-index: 1;
    }
    .inline-search-bar .inline-filter-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      width: 1.1rem;
      height: 1.1rem;
      color: #fbbf24;
      pointer-events: none;
      opacity: 0.9;
      z-index: 1;
    }
    .inline-search-bar .inline-clear-btn {
      position: absolute;
      right: 0.5rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #94a3b8;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 0 0.25rem;
      border-radius: 0.25rem;
      opacity: 0.85;
      transition: background 0.15s;
      z-index: 2;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .inline-search-bar .inline-clear-btn:hover {
      background: #334155;
      color: #fff;
      opacity: 1;
    }
    .finding-result[hidden] {
      display: none !important;
    }
    .inline-highlight {
      background: #2563eb;
      color: #fff;
      border-radius: 0.25em;
      padding: 0 0.15em;
      font-weight: 600;
    }
    .inline-no-results {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(30,41,59,0.7);
      border: 1.5px dashed #334155;
      border-radius: 0.75rem;
      padding: 2.5rem 1rem;
      margin-top: 1.5rem;
      color: #e0e7ef;
      animation: fadeInNoResults 0.4s;
      min-height: 120px;
      text-align: center;
    }
    @keyframes fadeInNoResults {
      from { opacity: 0; transform: translateY(16px);}
      to { opacity: 1; transform: none;}
    }
    html, body {
      scrollbar-width: thin;
      scrollbar-color: #334155 #0f172a;
    }
    html::-webkit-scrollbar,
    body::-webkit-scrollbar {
      width: 12px;
      background: #0f172a;
    }
    html::-webkit-scrollbar-thumb,
    body::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #334155 40%, #1e293b 100%);
      border-radius: 8px;
      border: 2px solid #0f172a;
      min-height: 40px;
    }
    html::-webkit-scrollbar-thumb:hover,
    body::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #475569 40%, #334155 100%);
    }
    html::-webkit-scrollbar-corner,
    body::-webkit-scrollbar-corner {
      background: #0f172a;
    }
  </style>
  <script>
    // Inline search/filter for findings with clear button, highlight, and no results message
    window.addEventListener('DOMContentLoaded', function() {
      var input = document.getElementById('inline-findings-search');
      var clearBtn = document.getElementById('inline-findings-clear');
      var findingsList = document.getElementById('findings-list');
      var findings = document.querySelectorAll('.finding-result');
      var noResults = document.getElementById('inline-no-results');
      var severitySelect = document.getElementById('inline-severity-filter');
      function highlight(text, term) {
        if (!term) return text;
        // Escape regex special chars
        var safeTerm = term.replace(/[.*+?^{}()|[\]\\]/g, '\\$&');
        return text.replace(new RegExp(safeTerm, 'gi'), function(match) {
          return '<mark class="inline-highlight">' + match + '</mark>';
        });
      }
      function filterFindings() {
        var term = input.value.trim().toLowerCase();
        var selectedSeverity = severitySelect ? severitySelect.value : "all";
        var anyVisible = false;
        findings.forEach(function(finding) {
          // Remove previous highlights
          finding.innerHTML = finding.getAttribute('data-raw');
          var text = finding.innerText.toLowerCase();
          var matchesSearch = !term || text.includes(term);
          var matchesSeverity = selectedSeverity === "all" ||
            (finding.getAttribute('data-severity') === selectedSeverity);
          if (matchesSearch && matchesSeverity) {
            finding.hidden = false;
            if (term) {
              // Highlight all matches in the finding
              var html = finding.innerHTML;
              finding.innerHTML = highlight(html, term);
            }
            anyVisible = true;
          } else {
            finding.hidden = true;
          }
        });
        if (noResults) {
          noResults.style.display = anyVisible ? 'none' : 'flex';
        }
        // Show/hide clear button
        if (clearBtn) {
          clearBtn.style.display = input.value ? 'flex' : 'none';
        }
      }
      if (input) {
        input.addEventListener('input', filterFindings);
      }
      if (severitySelect) {
        severitySelect.addEventListener('change', filterFindings);
      }
      if (clearBtn) {
        clearBtn.addEventListener('click', function() {
          input.value = '';
          filterFindings();
          input.focus();
        });
      }
      // Store raw HTML for each finding for highlight reset
      findings.forEach(function(finding) {
        finding.setAttribute('data-raw', finding.innerHTML);
      });
      filterFindings();
    });
  </script>
</head>
<body class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <div class="text-center mb-12">
      <div class="flex items-center justify-center space-x-3 mb-6">
        <div class="p-3 bg-blue-600 rounded-xl shadow-lg">
          <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <h1 class="text-4xl font-bold text-white">SARIF Report Viewer</h1>
      </div>
      <p class="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
        Upload your Semgrep SARIF files to generate comprehensive security analysis reports
        with detailed findings, severity breakdowns, and actionable insights.
      </p>
      <div class="flex items-center justify-center mt-4">
        <span class="inline-flex items-center px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-slate-300 text-xs font-medium shadow">
          <svg class="h-4 w-4 mr-1 text-blue-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l2 2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Report generated: ${formattedTimestamp || ""}
        </span>
      </div>
    </div>
      <div class="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6 shadow-lg">
        <div class="flex items-center space-x-3 mb-4">
          <svg class="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <h2 class="text-2xl font-bold text-white">Security Analysis Report</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span class="text-slate-400">Tool:</span>
            <span class="ml-2 font-medium text-white">${summary.toolName} ${summary.toolVersion ? `v${summary.toolVersion}` : ""}</span>
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
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        ${(() => {
          const cards = [
            {
              label: "Critical",
              count: summary.criticalCount,
              color: "bg-red-500",
              bgColor: "bg-red-900/20",
              textColor: "text-red-300",
              borderColor: "border-red-700",
            },
            {
              label: "High",
              count: summary.highCount,
              color: "bg-orange-500",
              bgColor: "bg-orange-900/20",
              textColor: "text-orange-300",
              borderColor: "border-orange-700",
            },
            {
              label: "Medium",
              count: summary.mediumCount,
              color: "bg-amber-500",
              bgColor: "bg-amber-900/20",
              textColor: "text-amber-300",
              borderColor: "border-amber-700",
            },
            {
              label: "Low",
              count: summary.lowCount,
              color: "bg-blue-500",
              bgColor: "bg-blue-900/20",
              textColor: "text-blue-300",
              borderColor: "border-blue-700",
            },
            {
              label: "Info",
              count: summary.infoCount,
              color: "bg-slate-500",
              bgColor: "bg-slate-800/50",
              textColor: "text-slate-300",
              borderColor: "border-slate-600",
            },
          ];
          return cards
            .map(
              (card) => `
            <div class="${card.bgColor} ${card.borderColor} backdrop-blur-sm rounded-lg border p-6 transition-all hover:scale-105 hover:shadow-lg">
              <div class="flex items-center justify-between mb-3">
                <div class="h-5 w-5 ${card.textColor}"><!-- icon placeholder --></div>
                ${card.count > 0 ? `<div class="w-3 h-3 rounded-full ${card.color}"></div>` : ""}
              </div>
              <div class="space-y-1">
                <p class="text-2xl font-bold text-white">${card.count}</p>
                <p class="text-sm font-medium ${card.textColor}">${card.label}</p>
              </div>
            </div>
          `,
            )
            .join("");
        })()}
      </div>
      <div class="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6 shadow-lg">
        <h3 class="text-lg font-semibold text-white mb-4">Severity Distribution</h3>
        <div class="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
          <div class="h-full flex">
            ${(() => {
              const total = summary.totalFindings;
              const cards = [
                {
                  label: "Critical",
                  count: summary.criticalCount,
                  color: "bg-red-500",
                },
                {
                  label: "High",
                  count: summary.highCount,
                  color: "bg-orange-500",
                },
                {
                  label: "Medium",
                  count: summary.mediumCount,
                  color: "bg-amber-500",
                },
                { label: "Low", count: summary.lowCount, color: "bg-blue-500" },
                {
                  label: "Info",
                  count: summary.infoCount,
                  color: "bg-slate-500",
                },
              ];
              return cards
                .map((card) => {
                  const percentage = total > 0 ? (card.count / total) * 100 : 0;
                  return `<div class="${card.color}" style="width: ${percentage}%"></div>`;
                })
                .join("");
            })()}
          </div>
        </div>
        <div class="flex justify-between text-xs text-slate-400 mt-2">
          <span>0</span>
          <span>${summary.totalFindings} total findings</span>
        </div>
      </div>
      <div class="space-y-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div class="flex items-center gap-2">
            <h2 class="text-2xl font-bold text-white">Security Findings</h2>
            <span class="text-slate-400">${results.length} findings</span>
          </div>
        </div>
        <div class="inline-search-bar">
          <svg class="inline-search-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <input
            id="inline-findings-search"
            type="search"
            placeholder="Search findings, files, or rule IDs..."
            autocomplete="off"
            spellcheck="false"
            aria-label="Search findings"
          />
          <button id="inline-findings-clear" class="inline-clear-btn" type="button" style="display:none;" aria-label="Clear search">
            &#10005;
          </button>
          <span style="position:relative;">
            <svg class="inline-filter-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="left:0.75rem;">
              <path d="M4 6h16M6 10h12M8 14h8M10 18h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <select id="inline-severity-filter" aria-label="Filter by severity">
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
              <option value="info">Info</option>
            </select>
          </span>
        </div>
        <div class="space-y-6" id="findings-list">
          <div id="inline-no-results" class="inline-no-results" style="display:none;">
            <svg class="h-12 w-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="8" y1="8" x2="16" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <h3 class="text-lg font-medium text-white mb-2">No results found</h3>
            <p class="text-slate-400">Try a different search term.</p>
          </div>
          ${
            results.length === 0
              ? `<div class="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-12 text-center shadow-lg">
                <svg class="h-12 w-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <line x1="8" y1="8" x2="16" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <h3 class="text-lg font-medium text-white mb-2">No findings found</h3>
                <p class="text-slate-400">This SARIF file contains no security findings.</p>
              </div>`
              : results
                  .map((result) => {
                    const severityColors: Record<
                      string,
                      {
                        bg: string;
                        text: string;
                        border: string;
                        icon: string;
                        badge: string;
                      }
                    > = {
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
                        badge:
                          "bg-orange-900/40 text-orange-300 border-orange-700",
                      },
                      medium: {
                        bg: "bg-amber-900/20",
                        text: "text-amber-300",
                        border: "border-amber-700",
                        icon: "text-amber-400",
                        badge:
                          "bg-amber-900/40 text-amber-300 border-amber-700",
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
                        badge:
                          "bg-slate-700/50 text-slate-300 border-slate-600",
                      },
                    };
                    const colors =
                      severityColors[result.severity] ?? severityColors["info"];
                    return `
                  <div class="finding-result ${colors.bg} ${colors.border} backdrop-blur-sm border rounded-lg p-6 transition-all hover:shadow-lg hover:scale-[1.01]" data-severity="${result.severity}">
                    <div class="flex items-start space-x-4">
                      <div class="h-6 w-6 ${colors.icon} mt-1 flex-shrink-0"><!-- icon placeholder --></div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between mb-3">
                          <div class="flex items-center space-x-3">
                            <span class="inline-flex px-3 py-1 text-xs font-medium rounded-full ${colors.badge} border">${result.severity.toUpperCase()}</span>
                            <span class="text-sm text-slate-400">${result.ruleId}</span>
                          </div>
                        </div>
                        <h3 class="text-xl font-semibold text-white mb-2">${result.ruleName}</h3>
                        <p class="text-slate-300 mb-4 leading-relaxed">${result.message}</p>
                        <div class="flex items-center space-x-6 text-sm text-slate-400">
                          <div class="flex items-center space-x-2">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 9l5-5 5 5M12 4v12" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            <span>${result.file}</span>
                          </div>
                          ${result.startLine ? `<span>Line ${result.startLine}${result.endLine && result.endLine !== result.startLine ? `-${result.endLine}` : ""}</span>` : ""}
                        </div>
                        ${result.tags.length > 0 ? `<div class="flex flex-wrap gap-2 mt-4">${result.tags.map((tag: string) => `<span class="inline-flex px-2 py-1 text-xs bg-slate-700/50 text-slate-300 rounded border border-slate-600">${tag}</span>`).join("")}</div>` : ""}
                      </div>
                    </div>
                    ${
                      result.description || result.snippet
                        ? `
                      <div class="mt-6 pt-6 border-t border-slate-600">
                        ${
                          result.description
                            ? `
                          <div class="mb-6">
                            <h4 class="font-medium text-white mb-3">Description</h4>
                            <p class="text-slate-300 text-sm leading-relaxed">${result.description}</p>
                          </div>
                        `
                            : ""
                        }
                        ${
                          result.snippet
                            ? `
                          <div>
                            <h4 class="font-medium text-white mb-3">Code Snippet</h4>
                            <pre class="bg-slate-900/80 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto border border-slate-700"><code>${result.snippet}</code></pre>
                          </div>
                        `
                            : ""
                        }
                      </div>
                    `
                        : ""
                    }
                  </div>
                  `;
                  })
                  .join("")
          }
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
