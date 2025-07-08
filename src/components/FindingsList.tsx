import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  FileText,
  AlertTriangle,
  Info,
  CheckCircle,
} from "lucide-react";
import { ProcessedResult } from "../types/report";

interface FindingsListProps {
  results: ProcessedResult[];
}

export const FindingsList: React.FC<FindingsListProps> = ({ results }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [selectedFinding, setSelectedFinding] =
    useState<ProcessedResult | null>(null);

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

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
      case "high":
        return AlertTriangle;
      case "medium":
        return Info;
      case "low":
      case "info":
      default:
        return CheckCircle;
    }
  };

  const filteredResults = useMemo(() => {
    return results.filter((result) => {
      const matchesSearch =
        searchTerm === "" ||
        result.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.file.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.ruleId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSeverity =
        severityFilter === "all" || result.severity === severityFilter;

      return matchesSearch && matchesSeverity;
    });
  }, [results, searchTerm, severityFilter]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Security Findings</h2>
        <span className="text-slate-400">
          {filteredResults.length} findings
        </span>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search findings, files, or rule IDs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-400"
              />
            </div>
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="pl-10 pr-8 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none text-white"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
              <option value="info">Info</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="mt-4 text-sm text-slate-400">
          Showing {filteredResults.length} of {results.length} findings
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-6">
        {filteredResults.map((result) => {
          const colors =
            severityColors[result.severity as keyof typeof severityColors];
          const SeverityIcon = getSeverityIcon(result.severity);

          return (
            <div
              key={result.id}
              className={`${colors.bg} ${colors.border} backdrop-blur-sm border rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.01]`}
              onClick={() =>
                setSelectedFinding(
                  selectedFinding?.id === result.id ? null : result,
                )
              }
            >
              <div className="flex items-start space-x-4">
                <SeverityIcon
                  className={`h-6 w-6 ${colors.icon} mt-1 flex-shrink-0`}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${colors.badge} border`}
                      >
                        {result.severity.toUpperCase()}
                      </span>
                      <span className="text-sm text-slate-400">
                        {result.ruleId}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-slate-400 transition-transform ${selectedFinding?.id === result.id ? "rotate-180" : ""}`}
                    />
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-2">
                    {result.ruleName}
                  </h3>
                  <p className="text-slate-300 mb-4 leading-relaxed">
                    {result.message}
                  </p>

                  <div className="flex items-center space-x-6 text-sm text-slate-400">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>{result.file}</span>
                    </div>
                    {result.startLine && (
                      <span>
                        Line {result.startLine}
                        {result.endLine && result.endLine !== result.startLine
                          ? `-${result.endLine}`
                          : ""}
                      </span>
                    )}
                  </div>

                  {result.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {result.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex px-2 py-1 text-xs bg-slate-700/50 text-slate-300 rounded border border-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {selectedFinding?.id === result.id && (
                <div className="mt-6 pt-6 border-t border-slate-600">
                  {result.description && (
                    <div className="mb-6">
                      <h4 className="font-medium text-white mb-3">
                        Description
                      </h4>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {result.description}
                      </p>
                    </div>
                  )}

                  {result.snippet && (
                    <div>
                      <h4 className="font-medium text-white mb-3">
                        Code Snippet
                      </h4>
                      <pre className="bg-slate-900/80 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto border border-slate-700">
                        <code>{result.snippet}</code>
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredResults.length === 0 && (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-12 text-center shadow-lg">
          <svg
            className="h-12 w-12 text-slate-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle
              cx="11"
              cy="11"
              r="8"
              stroke="currentColor"
              strokeWidth={2}
            />
            <line
              x1="21"
              y1="21"
              x2="16.65"
              y2="16.65"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            />
            <line
              x1="8"
              y1="8"
              x2="16"
              y2="16"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            />
          </svg>
          <h3 className="text-lg font-medium text-white mb-2">
            No findings found
          </h3>
          <p className="text-slate-400">
            {searchTerm || severityFilter !== "all"
              ? "Try adjusting your search criteria or filters."
              : "This SARIF file contains no security findings."}
          </p>
        </div>
      )}
    </div>
  );
};
