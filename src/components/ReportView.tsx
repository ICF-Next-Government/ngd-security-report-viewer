import React, { useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import {
  ProcessedResult,
  ReportSummary as ReportSummaryType,
} from "../types/sarif";
import { ReportSummary } from "./ReportSummary";
import { FindingsList } from "./FindingsList";

interface ReportViewProps {
  results: ProcessedResult[];
  summary: ReportSummaryType;
  onBack: () => void;
  uploadTimestamp?: Date | null;
}

export const ReportView: React.FC<ReportViewProps> = ({
  results,
  summary,
  onBack,
  uploadTimestamp,
}) => {
  const [isExporting, setIsExporting] = useState(false);

  // Format timestamp for display
  const formattedTimestamp = uploadTimestamp
    ? uploadTimestamp.toLocaleString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : null;

  const handleExportHTML = () => {
    setIsExporting(true);
    try {
      // Export a static HTML file that closely matches the in-app report (Shadcn/Tailwind look)
      // Inline TailwindCSS via CDN and custom styles for a clean, modern, dark report
      const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Security Analysis Report</title>
  <link href="https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.0/index.min.css" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com?plugins=typography"></script>
  <style>
    /* ...styles omitted for brevity, unchanged... */
    /* Stylish dark scrollbar for exported HTML */
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
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-white">Security Findings</h2>
          <span class="text-slate-400">${results.length} findings</span>
        </div>
        <div class="space-y-6">
          ${
            results.length === 0
              ? `<div class="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-12 text-center shadow-lg">
                  <svg class="h-12 w-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 9l5-5 5 5M12 4v12" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  <h3 class="text-lg font-medium text-white mb-2">No findings found</h3>
                  <p class="text-slate-400">This SARIF file contains no security findings.</p>
                </div>`
              : results
                  .map((result, idx) => {
                    const severityColors = {
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
                    const colors = severityColors[result.severity];
                    return `
                  <div class="${colors.bg} ${colors.border} backdrop-blur-sm border rounded-lg p-6 transition-all hover:shadow-lg hover:scale-[1.01]">
                    <div class="flex items-start space-x-4">
                      <div class="h-6 w-6 ${colors.icon} mt-1 flex-shrink-0"><!-- icon --></div>
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
                        ${result.tags.length > 0 ? `<div class="flex flex-wrap gap-2 mt-4">${result.tags.map((tag) => `<span class="inline-flex px-2 py-1 text-xs bg-slate-700/50 text-slate-300 rounded border border-slate-600">${tag}</span>`).join("")}</div>` : ""}
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
      `.trim();

      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `security-report-${new Date().toISOString().split("T")[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating HTML report:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800/70 backdrop-blur-xl border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Upload</span>
              </button>

              <div className="h-6 border-l border-slate-600"></div>

              <h1 className="text-xl font-semibold text-white">
                Security Analysis Report
              </h1>
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative group">
                <button
                  onClick={handleExportHTML}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700/50 border border-slate-600 rounded-lg hover:bg-slate-600/50 transition-colors"
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  <span>{isExporting ? "Exporting..." : "Export as HTML"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        id="report-content"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in"
        style={{ animation: "fadeIn 0.7s" }}
      >
        {/* Timestamp badge at the top */}
        {formattedTimestamp && (
          <div className="flex justify-center mb-6">
            <span
              className="inline-flex items-center px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-slate-300 text-xs font-medium shadow"
              title={uploadTimestamp?.toISOString() || ""}
              tabIndex={0}
              aria-label={`Report generated: ${formattedTimestamp} (click for exact time)`}
            >
              <svg
                className="h-4 w-4 mr-1 text-blue-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
                <path
                  d="M12 8v4l2 2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Report generated: {formattedTimestamp}
            </span>
          </div>
        )}
        <div className="animate-fade-in" style={{ animation: "fadeIn 1s" }}>
          <ReportSummary summary={summary} />
        </div>
        <div className="animate-fade-in" style={{ animation: "fadeIn 1.3s" }}>
          <FindingsList results={results} />
        </div>
      </div>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(16px);}
            to { opacity: 1; transform: none;}
          }
          .animate-fade-in {
            animation: fadeIn 0.7s;
          }
        `}
      </style>
    </div>
  );
};
