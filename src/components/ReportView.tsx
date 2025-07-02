import React, { useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import {
  ProcessedResult,
  ReportSummary as ReportSummaryType,
} from "../types/sarif";
import { ReportSummary } from "./ReportSummary";
import { FindingsList } from "./FindingsList";
import { generateHtml } from "../shared/generateHtml";

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
      const htmlContent = generateHtml({
        summary,
        results,
        generatedAt: uploadTimestamp
          ? uploadTimestamp.toISOString()
          : undefined,
      });

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
                  className="flex items-center justify-center w-full sm:w-auto space-x-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-slate-300 bg-slate-700/50 border border-slate-600 rounded-lg hover:bg-slate-600/50 transition-colors"
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  <span className="inline sm:hidden">
                    {isExporting ? "Exporting..." : "Export"}
                  </span>
                  <span className="hidden sm:inline">
                    {isExporting ? "Exporting..." : "Export as HTML"}
                  </span>
                </button>
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
