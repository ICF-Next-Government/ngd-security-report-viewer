import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import React, { useMemo } from "react";
import {
  ProcessedResult,
  ReportSummary as ReportSummaryType,
} from "@/types/report";
import { DeduplicationService } from "@/utils/deduplication";

type ReportSummaryProps = {
  summary: ReportSummaryType;
  results?: ProcessedResult[];
};

export const ReportSummary: React.FC<ReportSummaryProps> = ({
  summary,
  results,
}) => {
  // Safeguard against undefined summary or missing properties
  const safeSummary = {
    criticalCount: summary?.criticalCount || 0,
    highCount: summary?.highCount || 0,
    mediumCount: summary?.mediumCount || 0,
    lowCount: summary?.lowCount || 0,
    infoCount: summary?.infoCount || 0,
    totalFindings: summary?.totalFindings || 0,
    filesAffected: summary?.filesAffected || 0,
    toolName: summary?.toolName || "Unknown",
    toolVersion: summary?.toolVersion || undefined,
    timestamp: summary?.timestamp || undefined,
    format: summary?.format || "sarif",
    severityCounts: {
      critical: summary?.severityCounts?.critical || 0,
      high: summary?.severityCounts?.high || 0,
      medium: summary?.severityCounts?.medium || 0,
      low: summary?.severityCounts?.low || 0,
      info: summary?.severityCounts?.info || 0,
    },
  };

  const severityCards = [
    {
      label: "Critical",
      count: safeSummary.criticalCount || 0,
      color: "bg-red-500",
      bgColor: "bg-red-900/20",
      textColor: "text-red-300",
      borderColor: "border-red-700",
      icon: AlertTriangle,
    },
    {
      label: "High",
      count: safeSummary.highCount || 0,
      color: "bg-orange-500",
      bgColor: "bg-orange-900/20",
      textColor: "text-orange-300",
      borderColor: "border-orange-700",
      icon: AlertTriangle,
    },
    {
      label: "Medium",
      count: safeSummary.mediumCount || 0,
      color: "bg-amber-500",
      bgColor: "bg-amber-900/20",
      textColor: "text-amber-300",
      borderColor: "border-amber-700",
      icon: Info,
    },
    {
      label: "Low",
      count: safeSummary.lowCount || 0,
      color: "bg-blue-500",
      bgColor: "bg-blue-900/20",
      textColor: "text-blue-300",
      borderColor: "border-blue-700",
      icon: Info,
    },
    {
      label: "Info",
      count: safeSummary.infoCount || 0,
      color: "bg-slate-500",
      bgColor: "bg-slate-800/50",
      textColor: "text-slate-300",
      borderColor: "border-slate-600",
      icon: CheckCircle,
    },
  ];

  const deduplicationStats = useMemo(() => {
    if (!results || results.length === 0) return null;

    const groups = DeduplicationService.deduplicateFindings(results);
    const totalDuplicates = results.length - groups.length;
    const duplicatePercentage = (
      (totalDuplicates / results.length) *
      100
    ).toFixed(1);

    return {
      uniqueGroups: groups.length,
      totalDuplicates,
      duplicatePercentage,
    };
  }, [results]);

  return (
    <div className="space-y-8">
      {/* Report Overview */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-blue-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h8l4 4v12a2 2 0 01-2 2z"
              />
            </svg>
            <h2 className="text-lg font-semibold text-white">Overview</h2>
          </div>
          <span className="text-xs text-slate-400">
            {safeSummary.toolName}
            {safeSummary.toolVersion ? ` v${safeSummary.toolVersion}` : ""}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-900/20 rounded-md p-3 border border-blue-500 border-opacity-50 hover:border-opacity-70 transition-all">
            <div className="flex items-start gap-2">
              <div className="p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
                <svg
                  className="h-4 w-4 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-white uppercase tracking-wider font-medium mb-1">
                  Findings
                </p>
                <p className="text-2xl font-bold text-white leading-none">
                  {safeSummary.totalFindings.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-amber-900/20 rounded-md p-3 border border-amber-500 border-opacity-50 hover:border-opacity-70 transition-all">
            <div className="flex items-start gap-2">
              <div className="p-2 bg-amber-500/20 rounded-lg flex-shrink-0">
                <svg
                  className="h-4 w-4 text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-white uppercase tracking-wider font-medium mb-1">
                  Files
                </p>
                <p className="text-2xl font-bold text-white leading-none">
                  {safeSummary.filesAffected.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-900/20 rounded-md p-3 border border-purple-500 border-opacity-50 hover:border-opacity-70 transition-all">
            <div className="flex items-start gap-2">
              <div className="p-2 bg-purple-500/20 rounded-lg flex-shrink-0">
                <svg
                  className="h-4 w-4 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-white uppercase tracking-wider font-medium mb-1">
                  Severity
                </p>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-xl font-bold leading-none ${
                      safeSummary.criticalCount > 0
                        ? "text-red-400"
                        : safeSummary.highCount > 0
                          ? "text-orange-400"
                          : safeSummary.mediumCount > 0
                            ? "text-amber-400"
                            : safeSummary.lowCount > 0
                              ? "text-blue-400"
                              : "text-slate-400"
                    }`}
                  >
                    {safeSummary.criticalCount > 0
                      ? "Critical"
                      : safeSummary.highCount > 0
                        ? "High"
                        : safeSummary.mediumCount > 0
                          ? "Medium"
                          : safeSummary.lowCount > 0
                            ? "Low"
                            : "Info"}
                  </span>
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      safeSummary.criticalCount > 0
                        ? "bg-red-500"
                        : safeSummary.highCount > 0
                          ? "bg-orange-500"
                          : safeSummary.mediumCount > 0
                            ? "bg-amber-500"
                            : safeSummary.lowCount > 0
                              ? "bg-blue-500"
                              : "bg-slate-500"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deduplication Stats Integrated */}
        {deduplicationStats && deduplicationStats.totalDuplicates > 0 && (
          <div className="mt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  />
                </svg>
                <span className="text-xs font-medium text-white">
                  Deduplication Analysis
                </span>
              </div>
              <div className="flex items-center divide-x divide-slate-600/50 text-xs">
                <div className="flex items-center gap-2 px-3 first:pl-0">
                  <span className="text-slate-400">Groups:</span>
                  <span className="font-medium text-white">
                    {deduplicationStats.uniqueGroups}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3">
                  <span className="text-slate-400">Duplicates:</span>
                  <span className="font-medium text-orange-300">
                    {deduplicationStats.totalDuplicates}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 last:pr-0">
                  <span className="text-slate-400">Rate:</span>
                  <span className="font-medium text-orange-300">
                    {deduplicationStats.duplicatePercentage}%
                  </span>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">
              Similar issues have been automatically grouped to reduce noise in
              the report.
            </p>
          </div>
        )}
      </div>

      {/* Severity Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {severityCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`${card.bgColor} ${card.borderColor} backdrop-blur-sm rounded-lg border p-6 transition-all hover:scale-105 hover:shadow-lg`}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className={`h-5 w-5 ${card.textColor}`} />
                {card.count > 0 && (
                  <div className={`w-3 h-3 rounded-full ${card.color}`}></div>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-white">{card.count}</p>
                <p className={`text-sm font-medium ${card.textColor}`}>
                  {card.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">
          Severity Distribution
        </h3>
        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
          <div className="h-full flex">
            {severityCards.map((card) => {
              const percentage =
                safeSummary.totalFindings > 0
                  ? (card.count / safeSummary.totalFindings) * 100
                  : 0;
              return (
                <div
                  key={card.label}
                  className={card.color}
                  style={{ width: `${percentage}%` }}
                  title={`${card.label}: ${card.count} (${percentage.toFixed(1)}%)`}
                ></div>
              );
            })}
          </div>
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-2">
          <span>0</span>
          <span>{safeSummary.totalFindings} total findings</span>
        </div>
      </div>
    </div>
  );
};
