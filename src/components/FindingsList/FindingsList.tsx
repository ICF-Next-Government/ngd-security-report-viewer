import { ProcessedResult, ViewMode } from "@/types/report";
import { DeduplicationService } from "@/utils/deduplication";
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  FileText,
  Filter,
  Info,
  Layers,
  List,
  Search,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type FC, useMemo, useState } from "react";

/**
 * FindingsList Component
 *
 * Displays security findings with advanced filtering and grouping capabilities.
 *
 * Features:
 * - Real-time search across findings
 * - Filter by severity level
 * - Deduplicated view to group similar findings
 * - Expandable details for each finding
 * - Color-coded severity indicators
 *
 * @param results - Array of processed security findings from the scan
 */
type FindingsListProps = {
  results: ProcessedResult[];
};

export const FindingsList: FC<FindingsListProps> = ({ results }) => {
  // UI state for search and filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [selectedFinding, setSelectedFinding] = useState<ProcessedResult | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("deduplicated");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  /**
   * Toggles the expanded state of a finding group in deduplicated view
   */
  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

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

      const matchesSeverity = severityFilter === "all" || result.severity === severityFilter;

      return matchesSearch && matchesSeverity;
    });
  }, [results, searchTerm, severityFilter]);

  const deduplicatedGroups = useMemo(() => {
    if (viewMode === "all") return null;
    return DeduplicationService.deduplicateFindings(filteredResults);
  }, [filteredResults, viewMode]);

  const displayCount =
    viewMode === "deduplicated" && deduplicatedGroups
      ? deduplicatedGroups.length
      : filteredResults.length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Security Findings</h2>
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-700/50 rounded-lg p-1">
            <button
              onClick={() => setViewMode("deduplicated")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === "deduplicated"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Layers className="h-4 w-4" />
              Grouped
            </button>
            <button
              onClick={() => setViewMode("all")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === "all" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <List className="h-4 w-4" />
              All
            </button>
          </div>
          <span className="text-slate-400">
            {displayCount} {viewMode === "deduplicated" ? "groups" : "findings"}
          </span>
        </div>
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
            {/* Severity filter dropdown */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="pl-10 pr-4 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
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
      {/* Findings list - renders differently based on view mode */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === "deduplicated" && deduplicatedGroups
            ? // Deduplicated view - shows grouped findings
              deduplicatedGroups.map((group, index) => {
                const result = group.representativeResult;
                const colors = severityColors[result.severity as keyof typeof severityColors];
                const SeverityIcon = getSeverityIcon(result.severity);
                const isExpanded = expandedGroups.has(group.id);

                return (
                  <motion.div
                    key={group.id}
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div
                      className={`${colors.bg} ${colors.border} backdrop-blur-sm border rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.01]`}
                      onClick={() => toggleGroup(group.id)}
                    >
                      <div className="flex items-start space-x-4">
                        <SeverityIcon className={`h-6 w-6 ${colors.icon} mt-1 flex-shrink-0`} />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <span
                                className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${colors.badge} border`}
                              >
                                {result.severity.toUpperCase()}
                              </span>
                              <span className="text-sm text-slate-400">{result.ruleId}</span>
                              {group.occurrences > 1 && (
                                <span className="inline-flex px-2 py-1 text-xs font-medium bg-slate-700/50 text-slate-300 rounded-full border border-slate-600">
                                  {group.occurrences} occurrences
                                </span>
                              )}
                            </div>
                            <ChevronDown
                              className={`h-5 w-5 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                            />
                          </div>

                          <h3 className="text-xl font-semibold text-white mb-2">
                            {result.ruleName}
                          </h3>
                          <p className="text-slate-300 mb-4 leading-relaxed">{result.message}</p>

                          <div className="text-sm text-slate-400">
                            <p className="mb-2">{DeduplicationService.getGroupSummary(group)}</p>
                            {!isExpanded && group.affectedFiles.length <= 3 && (
                              <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4" />
                                <span>{group.affectedFiles.join(", ")}</span>
                              </div>
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

                      {/* Expanded Group Details */}
                      {isExpanded && (
                        <div className="mt-6 pt-6 border-t border-slate-600">
                          {result.description && (
                            <div className="mb-6">
                              <h4 className="font-medium text-white mb-3">Description</h4>
                              <p className="text-slate-300 text-sm leading-relaxed">
                                {result.description}
                              </p>
                            </div>
                          )}

                          <div className="mb-6">
                            <h4 className="font-medium text-white mb-3">All Occurrences</h4>
                            <div className="space-y-2">
                              {DeduplicationService.getGroupLocations(group).map(
                                (location, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center space-x-2 text-sm text-slate-400"
                                  >
                                    <FileText className="h-4 w-4 flex-shrink-0" />
                                    <span className="font-mono">{location}</span>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>

                          {result.snippet && (
                            <div>
                              <h4 className="font-medium text-white mb-3">
                                Code Snippet (from first occurrence)
                              </h4>
                              <pre className="bg-slate-900/80 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto border border-slate-700">
                                <code>{result.snippet}</code>
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })
            : // All findings view - shows individual findings
              filteredResults.map((result, index) => {
                const colors = severityColors[result.severity as keyof typeof severityColors];
                const SeverityIcon = getSeverityIcon(result.severity);

                return (
                  <motion.div
                    key={result.id}
                    className={`${colors.bg} ${colors.border} backdrop-blur-sm border rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg`}
                    onClick={() =>
                      setSelectedFinding(selectedFinding?.id === result.id ? null : result)
                    }
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                    layout
                  >
                    <div className="flex items-start space-x-4">
                      <SeverityIcon className={`h-6 w-6 ${colors.icon} mt-1 flex-shrink-0`} />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span
                              className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${colors.badge} border`}
                            >
                              {result.severity.toUpperCase()}
                            </span>
                            <span className="text-sm text-slate-400">{result.ruleId}</span>
                          </div>
                          <ChevronDown
                            className={`h-5 w-5 text-slate-400 transition-transform ${selectedFinding?.id === result.id ? "rotate-180" : ""}`}
                          />
                        </div>

                        <h3 className="text-xl font-semibold text-white mb-2">{result.ruleName}</h3>
                        <p className="text-slate-300 mb-4 leading-relaxed">{result.message}</p>

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
                    <AnimatePresence>
                      {selectedFinding?.id === result.id && (
                        <motion.div
                          className="mt-6 pt-6 border-t border-slate-600"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {result.description && (
                            <div className="mb-6">
                              <h4 className="font-medium text-white mb-3">Description</h4>
                              <p className="text-slate-300 text-sm leading-relaxed">
                                {result.description}
                              </p>
                            </div>
                          )}

                          {result.snippet && (
                            <div>
                              <h4 className="font-medium text-white mb-3">Code Snippet</h4>
                              <pre className="bg-slate-900/80 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto border border-slate-700">
                                <code>{result.snippet}</code>
                              </pre>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
        </motion.div>
      </AnimatePresence>

      {displayCount === 0 && (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-12 text-center shadow-lg">
          <svg
            className="h-12 w-12 text-slate-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth={2} />
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
          <h3 className="text-lg font-medium text-white mb-2">No findings found</h3>
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

FindingsList.displayName = "FindingsList";
