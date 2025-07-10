import React, { useMemo } from "react";
import { Shield, AlertTriangle, Info, CheckCircle, Layers } from "lucide-react";
import {
  ReportSummary as ReportSummaryType,
  ProcessedResult,
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
  const severityCards = [
    {
      label: "Critical",
      count: summary.criticalCount,
      color: "bg-red-500",
      bgColor: "bg-red-900/20",
      textColor: "text-red-300",
      borderColor: "border-red-700",
      icon: AlertTriangle,
    },
    {
      label: "High",
      count: summary.highCount,
      color: "bg-orange-500",
      bgColor: "bg-orange-900/20",
      textColor: "text-orange-300",
      borderColor: "border-orange-700",
      icon: AlertTriangle,
    },
    {
      label: "Medium",
      count: summary.mediumCount,
      color: "bg-amber-500",
      bgColor: "bg-amber-900/20",
      textColor: "text-amber-300",
      borderColor: "border-amber-700",
      icon: Info,
    },
    {
      label: "Low",
      count: summary.lowCount,
      color: "bg-blue-500",
      bgColor: "bg-blue-900/20",
      textColor: "text-blue-300",
      borderColor: "border-blue-700",
      icon: Info,
    },
    {
      label: "Info",
      count: summary.infoCount,
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
              {summary.toolName}{" "}
              {summary.toolVersion && `v${summary.toolVersion}`}
            </span>
          </div>
          <div>
            <span className="text-slate-400">Total Findings:</span>
            <span className="ml-2 font-medium text-white">
              {summary.totalFindings}
            </span>
          </div>
          <div>
            <span className="text-slate-400">Files Affected:</span>
            <span className="ml-2 font-medium text-white">
              {summary.filesAffected}
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
                summary.totalFindings > 0
                  ? (card.count / summary.totalFindings) * 100
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
          <span>{summary.totalFindings} total findings</span>
        </div>
      </div>
    </div>
  );
};
