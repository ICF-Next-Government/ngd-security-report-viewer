import { ProcessedResult, ReportSummary as ReportSummaryType } from "@/types/report";
import { DeduplicationService } from "@/utils/deduplication";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import { motion } from "motion/react";
import { type FC, useMemo } from "react";

type ReportSummaryProps = {
  summary: ReportSummaryType;
  results?: ProcessedResult[];
};

export const ReportSummary: FC<ReportSummaryProps> = ({ summary, results }) => {
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
      color: "bg-yellow-500",
      bgColor: "bg-yellow-900/20",
      textColor: "text-yellow-300",
      borderColor: "border-yellow-700",
      icon: AlertTriangle,
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
      color: "bg-gray-500",
      bgColor: "bg-gray-900/20",
      textColor: "text-gray-300",
      borderColor: "border-gray-700",
      icon: Info,
    },
  ];

  // Calculate deduplication stats if results are provided
  const deduplicationStats = useMemo(() => {
    if (!results || results.length === 0) return null;

    const deduplicatedGroups = DeduplicationService.deduplicateFindings(results, {
      groupByRuleId: true,
      groupBySimilarMessage: true,
      similarityThreshold: 0.85,
    });

    const totalDuplicates = results.length - deduplicatedGroups.length;
    const duplicatePercentage =
      results.length > 0 ? ((totalDuplicates / results.length) * 100).toFixed(1) : "0";

    return {
      uniqueGroups: deduplicatedGroups.length,
      totalDuplicates,
      duplicatePercentage,
    };
  }, [results]);

  return (
    <div className="space-y-6">
      {/* Header with tool info */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-white mb-2">Security Analysis Report</h2>
        <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
          <span>
            Tool: {safeSummary.toolName}
            {safeSummary.toolVersion && ` v${safeSummary.toolVersion}`}
          </span>
          <span>•</span>
          <span>Format: {safeSummary.format.toUpperCase()}</span>
          <span>•</span>
          <span>{safeSummary.filesAffected} files affected</span>
        </div>
      </motion.div>

      {/* Severity breakdown cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {severityCards.map((card, index) => (
          <motion.div
            key={card.label}
            className={`${card.bgColor} ${card.borderColor} backdrop-blur-sm rounded-lg border p-4 hover:shadow-lg transition-all`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-start justify-between mb-2">
              <card.icon className={`h-5 w-5 ${card.textColor}`} />
              <span className={`text-xs font-medium ${card.textColor}`}>{card.label}</span>
            </div>
            <div className={`text-2xl font-bold ${card.textColor}`}>{card.count}</div>
            <div className="text-xs text-slate-500 mt-1">
              {safeSummary.totalFindings > 0
                ? `${((card.count / safeSummary.totalFindings) * 100).toFixed(1)}%`
                : "0%"}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6 hover:border-slate-600 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Total Findings</p>
              <p className="text-3xl font-bold text-white">{safeSummary.totalFindings}</p>
            </div>
            <div className="p-3 bg-blue-900/30 rounded-full">
              <AlertTriangle className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6 hover:border-slate-600 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Files Affected</p>
              <p className="text-3xl font-bold text-white">{safeSummary.filesAffected}</p>
            </div>
            <div className="p-3 bg-purple-900/30 rounded-full">
              <Info className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6 hover:border-slate-600 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Severity Level</p>
              <p className="text-3xl font-bold text-white">
                {safeSummary.criticalCount > 0
                  ? "Critical"
                  : safeSummary.highCount > 0
                    ? "High"
                    : safeSummary.mediumCount > 0
                      ? "Medium"
                      : safeSummary.lowCount > 0
                        ? "Low"
                        : "Info"}
              </p>
            </div>
            <div className="p-3 bg-green-900/30 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Deduplication Stats */}
      {deduplicationStats && deduplicationStats.totalDuplicates > 0 && (
        <motion.div
          className="bg-slate-800/30 backdrop-blur-sm rounded-lg border border-slate-700 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-900/30 rounded-lg">
                <Info className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">Deduplication Active</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {deduplicationStats.totalDuplicates} duplicate findings hidden
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-slate-400">Unique Groups</p>
                <p className="text-lg font-bold text-white">{deduplicationStats.uniqueGroups}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Reduction</p>
                <p className="text-lg font-bold text-purple-400">
                  {deduplicationStats.duplicatePercentage}%
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

ReportSummary.displayName = "ReportSummary";
