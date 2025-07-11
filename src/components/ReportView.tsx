import { ArrowLeft, Download } from "lucide-react";
import React, { useState } from "react";
import { generateStaticHtml } from "../shared/static-html-export";
import {
  ProcessedResult,
  ReportSummary as ReportSummaryType,
} from "../types/report";
import { FindingsList } from "./FindingsList";
import { ReportSummary } from "./ReportSummary";

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
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Validate and provide safe defaults for summary and results
  const safeResults = results || [];
  const safeSummary: ReportSummaryType = {
    totalFindings: 0,
    criticalCount: 0,
    highCount: 0,
    mediumCount: 0,
    lowCount: 0,
    infoCount: 0,
    filesAffected: 0,
    toolName: "Unknown Tool",
    format: "sarif" as const,
    ...summary,
    severityCounts: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0,
      ...(summary?.severityCounts || {}),
    },
  };

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
        setTimeout(() => reject(new Error("Export timeout")), 30000);
      });

      const exportPromise = new Promise<void>((resolve, reject) => {
        try {
          // Validate input data
          if (!safeSummary || !safeResults || safeResults.length === 0) {
            console.error(
              "❌ Export validation failed: No report data available",
            );
            throw new Error(
              "No report data available to export. Please upload a valid security report first.",
            );
          }

          console.log("📝 Generating HTML content...");
          const startTime = performance.now();

          // Generate HTML content
          const htmlContent = generateStaticHtml({
            summary: safeSummary,
            results: safeResults,
            generatedAt: uploadTimestamp
              ? uploadTimestamp.toISOString()
              : undefined,
            enableDeduplication: true,
          });

          const generateTime = performance.now() - startTime;
          console.log(
            `✅ HTML generation completed in ${generateTime.toFixed(2)}ms`,
          );

          // Validate generated content
          if (!htmlContent || htmlContent.length < 1000) {
            console.error("❌ Generated HTML content validation failed:", {
              contentLength: htmlContent?.length || 0,
              contentPreview: htmlContent?.substring(0, 100) || "null",
            });
            throw new Error(
              "Failed to generate HTML report content. Please try again.",
            );
          }

          console.log("📦 Creating download blob...", {
            contentSize: `${(htmlContent.length / 1024).toFixed(1)} KB`,
            contentType: "text/html",
          });

          // Create and download the file
          const blob = new Blob([htmlContent], { type: "text/html" });
          const url = URL.createObjectURL(blob);
          const fileName = `security-report-${new Date().toISOString().split("T")[0]}.html`;

          // Try primary download method
          try {
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            a.style.display = "none";

            console.log("💾 Triggering download...", { fileName });

            document.body.appendChild(a);
            a.click();

            // Clean up
            setTimeout(() => {
              try {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                console.log("🧹 Download cleanup completed");
              } catch (cleanupError) {
                console.warn("⚠️ Cleanup error (non-critical):", cleanupError);
              }
            }, 100);

            console.log("✅ Export process completed successfully");
            resolve();
          } catch (downloadError) {
            console.warn(
              "⚠️ Primary download failed, trying fallback:",
              downloadError,
            );

            // Fallback: Open in new window/tab
            try {
              const newWindow = window.open();
              if (newWindow) {
                newWindow.document.write(htmlContent);
                newWindow.document.close();
                console.log("✅ Fallback: Opened report in new window");
                resolve();
              } else {
                throw new Error(
                  "Unable to open new window. Please check your browser's popup blocker settings.",
                );
              }
            } catch (fallbackError) {
              console.error("❌ Fallback method also failed:", fallbackError);
              throw new Error(
                "Unable to download or display the report. Please try a different browser or disable popup blockers.",
              );
            }
          }
        } catch (error) {
          console.error("❌ Export promise failed:", error);
          reject(error);
        }
      });

      // Wait for export with timeout
      await Promise.race([exportPromise, timeoutPromise]);

      console.log("🎉 HTML export completed successfully!");
      setExportSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      console.error("❌ HTML export failed:", error);

      // Enhanced error logging
      if (error instanceof Error) {
        console.error("Error details:", {
          message: error.message,
          stack: error.stack,
          name: error.name,
        });
      }

      let errorMessage = "Failed to export HTML report";

      if (error instanceof Error) {
        // Provide user-friendly error messages
        if (error.message.includes("timeout")) {
          errorMessage = "Export timed out. Please try again.";
        } else if (error.message.includes("Blob")) {
          errorMessage =
            "Your browser doesn't support file downloads. Please try a different browser.";
        } else if (error.message.includes("popup blocker")) {
          errorMessage = "Please disable popup blockers and try again.";
        } else if (error.message.includes("No report data")) {
          errorMessage =
            "No report data to export. Please upload a report first.";
        } else {
          errorMessage = error.message;
        }
      }

      setExportError(errorMessage);

      // Clear error message after 5 seconds
      setTimeout(() => setExportError(null), 5000);
    } finally {
      setIsExporting(false);
      console.log("🔄 Export process finished");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800/70 backdrop-blur-xl border-b border-slate-700 sticky top-0 z-10">
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

              <h1 className="text-base xs:text-lg sm:text-xl font-semibold text-white truncate max-w-[60vw] sm:max-w-none">
                Security Analysis Report
              </h1>
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
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                  ) : exportSuccess ? (
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : exportError ? (
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  <span className="inline sm:hidden">
                    {isExporting
                      ? "Exporting..."
                      : exportSuccess
                        ? "Success!"
                        : exportError
                          ? "Error"
                          : "Export"}
                  </span>
                  <span className="hidden sm:inline">
                    {isExporting
                      ? "Exporting..."
                      : exportSuccess
                        ? "HTML Exported!"
                        : exportError
                          ? "Export Failed"
                          : "Export as HTML"}
                  </span>
                </button>

                {/* Error tooltip */}
                {exportError && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-red-900/90 border border-red-700 rounded-lg text-red-200 text-xs max-w-xs text-center z-50 shadow-lg">
                    {exportError}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-red-700"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Sticky Back to Upload button for mobile */}
      <button
        onClick={onBack}
        className="fixed bottom-4 left-4 z-50 flex items-center px-4 py-2 rounded-lg bg-slate-800/90 border border-slate-700 text-slate-200 shadow-lg backdrop-blur-md transition-all hover:bg-slate-700/90 active:scale-95 sm:hidden"
        style={{ boxShadow: "0 2px 12px 0 rgba(30,41,59,0.25)" }}
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Upload
      </button>

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
          <ReportSummary summary={safeSummary} results={safeResults} />
        </div>
        <div className="animate-fade-in" style={{ animation: "fadeIn 1.3s" }}>
          <FindingsList results={safeResults} />
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
