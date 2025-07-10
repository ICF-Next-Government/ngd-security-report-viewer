import { AlertTriangle, CheckCircle, Info, Layers, Shield } from "lucide-react";
import React, { useMemo } from "react";
import {
  ProcessedResult,
  ReportSummary as ReportSummaryType,
} from "../types/report";
import { DeduplicationService } from "../utils/deduplication";

interface ReportSummaryProps {
  summary: ReportSummaryType;
  results?: ProcessedResult[];
}

export const ReportSummary: React.FC<ReportSummaryProps> = ({
  summary,
  results,
}) => {
  // Safeguard against undefined summary or missing properties
  const safeSummary = {
    criticalCount: 0,
    highCount: 0,
    mediumCount: 0,
    lowCount: 0,
    infoCount: 0,
    totalFindings: 0,
    filesAffected: 0,
    toolName: "Unknown",
    severityCounts: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0,
    },
    ...summary,
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
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="h-6 w-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">
            Security Analysis Report
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-slate-400">Tool:</span>
            <span className="ml-2 font-medium text-white">
              {safeSummary.toolName}{" "}
              {safeSummary.toolVersion && `v${safeSummary.toolVersion}`}
            </span>
          </div>
          <div>
            <span className="text-slate-400">Total Findings:</span>
            <span className="ml-2 font-medium text-white">
              {safeSummary.totalFindings}
            </span>
          </div>
          <div>
            <span className="text-slate-400">Files Affected:</span>
            <span className="ml-2 font-medium text-white">
              {safeSummary.filesAffected}
            </span>
          </div>
        </div>
      </div>

      {/* Deduplication Stats */}
      {deduplicationStats && deduplicationStats.totalDuplicates > 0 && (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <Layers className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">
              Deduplication Summary
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Unique Issue Groups:</span>
              <span className="ml-2 font-medium text-white">
                {deduplicationStats.uniqueGroups}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Duplicate Findings:</span>
              <span className="ml-2 font-medium text-orange-300">
                {deduplicationStats.totalDuplicates}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Duplication Rate:</span>
              <span className="ml-2 font-medium text-orange-300">
                {deduplicationStats.duplicatePercentage}%
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-4">
            Similar issues have been automatically grouped to reduce noise in
            the report.
          </p>
        </div>
      )}

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
