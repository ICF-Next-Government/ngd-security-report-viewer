import { ArrowLeft, Download, Shield } from "lucide-react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { generateStaticHtml } from "@/shared/static-html-export";
import {
  ProcessedResult,
  ReportSummary as ReportSummaryType,
} from "@/types/report";
import { FindingsList } from "@/components/FindingsList";
import { ReportSummary } from "@/components/ReportSummary";

/**
 * ReportView Component
 *
 * Main report viewing interface that displays security scan results.
 * Features:
 * - Security findings summary with severity breakdown
 * - Searchable and filterable findings list
 * - Export functionality to generate static HTML reports
 * - Responsive design with smooth animations
 *
 * @param results - Array of processed security findings
 * @param summary - Report metadata and statistics
 * @param onBack - Callback to return to the upload screen
 * @param uploadTimestamp - When the report was uploaded (for display)
 */
type ReportViewProps = {
  results: ProcessedResult[];
  summary: ReportSummaryType;
  onBack: () => void;
  uploadTimestamp?: Date | null;
};

export const ReportView: React.FC<ReportViewProps> = ({
  results,
  summary,
  onBack,
  uploadTimestamp,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  // Export state management
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState(false);

  /**
   * Ensure we have valid data to display, providing safe defaults
   * This prevents runtime errors if data is missing or malformed
   */
  const safeResults = results || [];
  const safeSummary: ReportSummaryType = {
    totalFindings: summary?.totalFindings || 0,
    criticalCount: summary?.criticalCount || 0,
    highCount: summary?.highCount || 0,
    mediumCount: summary?.mediumCount || 0,
    lowCount: summary?.lowCount || 0,
    infoCount: summary?.infoCount || 0,
    filesAffected: summary?.filesAffected || 0,
    toolName: summary?.toolName || "Unknown Tool",
    format: summary?.format || ("sarif" as const),
    severityCounts: {
      critical: summary?.severityCounts?.critical || 0,
      high: summary?.severityCounts?.high || 0,
      medium: summary?.severityCounts?.medium || 0,
      low: summary?.severityCounts?.low || 0,
      info: summary?.severityCounts?.info || 0,
    },
  };

  // Format timestamp for display if available
  const formattedTimestamp = uploadTimestamp
    ? uploadTimestamp.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : null;

  /**
   * Handles exporting the report as a static HTML file
   * Creates a self-contained HTML document with all styles embedded
   * for offline viewing and sharing
   */
  const handleExportHTML = async () => {
    setIsExporting(true);
    setExportError(null);
    setExportSuccess(false);

    console.log("🔄 Starting HTML export process...");
    console.log("📊 Export data:", {
      summaryPresent: !!summary,
      resultsCount: results?.length || 0,
      uploadTimestamp: uploadTimestamp?.toISOString(),
    });

    try {
      // Browser compatibility checks
      if (!window.Blob) {
        throw new Error(
          "Your browser doesn't support file downloads (Blob API not available)",
        );
      }

      if (!window.URL || !window.URL.createObjectURL) {
        throw new Error(
          "Your browser doesn't support file downloads (URL.createObjectURL not available)",
        );
      }

      const testAnchor = document.createElement("a");
      if (!("download" in testAnchor)) {
        throw new Error(
          "Your browser doesn't support file downloads (download attribute not supported)",
        );
      }

      console.log("✅ Browser compatibility checks passed");
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(
          () => reject(new Error("Export timeout - operation took too long")),
          30000,
        ); // 30 second timeout
      });

      const generatePromise = (async () => {
        console.log("⚙️ Generating HTML with summary:", safeSummary);
        console.log("⚙️ Results count:", safeResults.length);

        const html = await generateStaticHtml({
          summary: safeSummary,
          results: safeResults,
          generatedAt: formattedTimestamp || new Date().toISOString(),
          enableDeduplication: true,
        });

        console.log("✅ HTML generated, size:", html.length, "bytes");
        return html;
      })();

      const html = await Promise.race([generatePromise, timeoutPromise]);

      if (!html || typeof html !== "string" || html.length === 0) {
        throw new Error("Generated HTML is empty or invalid");
      }

      console.log("🔗 Creating blob...");
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });

      if (blob.size === 0) {
        throw new Error("Generated blob is empty");
      }

      console.log("💾 Blob created, size:", blob.size, "bytes");

      const url = URL.createObjectURL(blob);
      console.log("🔗 Object URL created:", url);

      const a = document.createElement("a");
      a.href = url;
      a.download = `security-report-${new Date().toISOString().split("T")[0]}.html`;

      // Add to DOM temporarily (some browsers require this)
      a.style.display = "none";
      document.body.appendChild(a);

      console.log("⬇️ Triggering download...");
      a.click();

      // Cleanup with delay to ensure download starts
      setTimeout(() => {
        console.log("🧹 Cleaning up resources...");
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 1000);

      console.log("✅ Export completed successfully!");
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      console.error("❌ Export failed:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during export";
      setExportError(errorMessage);
      setTimeout(() => setExportError(null), 5000);
    } finally {
      setIsExporting(false);
    }
  };

  // Clear error/success messages on unmount
  React.useEffect(() => {
    return () => {
      setExportError(null);
      setExportSuccess(false);
    };
  }, []);

  // Debug: Log component state on mount
  React.useEffect(() => {
    console.log("🔍 ReportView mounted with:", {
      resultsCount: results?.length || 0,
      summaryPresent: !!summary,
      uploadTimestamp: uploadTimestamp?.toISOString(),
    });
  }, [results, summary, uploadTimestamp]);

  // Auto-clear messages
  React.useEffect(() => {
    if (exportError) {
      const timer = setTimeout(() => setExportError(null), 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [exportError]);

  React.useEffect(() => {
    if (exportSuccess) {
      const timer = setTimeout(() => setExportSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [exportSuccess]);

  return (
    <motion.div
      className="min-h-screen bg-slate-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Navigation header with export functionality */}
      <motion.nav
        className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between h-auto sm:h-16 py-2 sm:py-0 gap-2 sm:gap-0">
            <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto space-x-2 sm:space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors px-2 py-1 sm:px-0 sm:py-0"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden xs:inline">Back to Upload</span>
              </button>

              <div className="h-6 border-l border-slate-600 hidden sm:block"></div>

              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <h1 className="text-base xs:text-lg sm:text-xl font-semibold text-white truncate max-w-[60vw] sm:max-w-none">
                  Security Analysis Report
                </h1>
                {formattedTimestamp && (
                  <span className="flex items-center gap-1 text-xs sm:text-sm text-slate-400 bg-slate-800/60 px-3 py-1 rounded-lg ml-2">
                    <svg
                      className="w-4 h-4 text-slate-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {formattedTimestamp}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end w-full sm:w-auto mt-2 sm:mt-0 space-x-2">
              <div className="relative group w-full sm:w-auto">
                <button
                  onClick={handleExportHTML}
                  className={`flex items-center justify-center w-full sm:w-auto space-x-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                    exportSuccess
                      ? "text-green-300 bg-green-700/50 border border-green-600"
                      : exportError
                        ? "text-red-300 bg-red-700/50 border border-red-600"
                        : "text-slate-300 bg-slate-700/50 border border-slate-600 hover:bg-slate-600/50"
                  }`}
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-slate-300"></div>
                      <span>Exporting...</span>
                    </>
                  ) : exportSuccess ? (
                    <>
                      <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Exported!</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Export HTML</span>
                    </>
                  )}
                </button>

                {/* Error/Success Messages */}
                <AnimatePresence>
                  {(exportError || exportSuccess) && (
                    <motion.div
                      className={`absolute top-full mt-2 right-0 w-64 sm:w-80 p-3 rounded-lg shadow-xl ${
                        exportError
                          ? "bg-red-900/90 border border-red-700"
                          : "bg-green-900/90 border border-green-700"
                      } backdrop-blur-sm z-50`}
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p
                        className={`text-sm ${exportError ? "text-red-200" : "text-green-200"}`}
                      >
                        {exportError || "Report exported successfully!"}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Sticky Back to Upload button for mobile */}
      <motion.button
        onClick={onBack}
        className="fixed bottom-4 left-4 z-50 flex items-center px-4 py-2 rounded-lg bg-slate-800/90 border border-slate-700 text-slate-200 shadow-lg backdrop-blur-md transition-all hover:bg-slate-700/90 active:scale-95 sm:hidden"
        style={{ boxShadow: "0 2px 12px 0 rgba(30,41,59,0.25)" }}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </motion.button>

      {/* Content */}
      <div>
        {/* Loading Overlay */}
        <AnimatePresence>
          {isExporting && (
            <motion.div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="flex flex-col items-center justify-center text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mb-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <p className="text-white text-lg font-medium">
                  Exporting report...
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Summary Section */}
        <motion.div
          className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ReportSummary summary={safeSummary} results={safeResults} />
        </motion.div>

        {/* Findings Section */}
        <motion.div
          className="max-w-7xl mx-auto px-4 pb-8 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <FindingsList results={safeResults} />
        </motion.div>
      </div>
    </motion.div>
  );
};
