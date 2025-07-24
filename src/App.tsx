import { LandingPage } from "@/components/LandingPage";
import { ReportView } from "@/components/ReportView";
import { ProcessedResult, ReportSummary } from "@/types/report";
import { ReportParser } from "@/utils/reportParser";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * Main application component that manages the security report viewer
 *
 * This component handles:
 * - File upload and JSON parsing
 * - Transitioning between landing page and report view
 * - Managing application state for security findings
 * - Smooth animations between views
 */
function App() {
  // Security report data state
  const [results, setResults] = useState<ProcessedResult[]>([]);
  const [summary, setSummary] = useState<ReportSummary | null>(null);

  // UI state management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showReport, setShowReport] = useState(false);
  const [uploadTimestamp, setUploadTimestamp] = useState<Date | null>(null);

  // Recent report tracking
  const [recentFileName, setRecentFileName] = useState<string | undefined>(
    undefined,
  );
  const [isRemovingReport, setIsRemovingReport] = useState(false);

  /**
   * Manages document scrollbar visibility based on the current view
   * - Report view: Hidden overflow (report has its own scrolling)
   * - Landing page: Auto overflow with hidden scrollbar (custom styling)
   */
  useEffect(() => {
    if (showReport) {
      // Report view - prevent document scrolling
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.documentElement.classList.remove("no-scrollbar");
      document.body.classList.remove("no-scrollbar");
    } else {
      // Landing page - allow scrolling but hide scrollbar
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
      document.documentElement.classList.add("no-scrollbar");
      document.body.classList.add("no-scrollbar");
    }
    return () => {
      // Cleanup: reset to default styles
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.documentElement.classList.remove("no-scrollbar");
      document.body.classList.remove("no-scrollbar");
    };
  }, [showReport]);

  /**
   * Handles file upload from the drag-and-drop interface
   * @param file - The uploaded JSON file containing security report data
   */
  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setError("");
    setUploadTimestamp(new Date());
    setRecentFileName(file.name);

    try {
      const fileContent = await file.text();
      const jsonData = JSON.parse(fileContent);

      // Parse the security report using the appropriate parser
      const parsed = ReportParser.parse(jsonData);
      setResults(parsed.results);
      setSummary(parsed.summary);

      // Show report view with smooth animation
      setShowReport(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? `Failed to parse file: ${err.message}`
          : "Failed to parse file. Please ensure it's a valid SARIF, Semgrep, or GitLab SAST JSON file.",
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles JSON input from the text editor
   * @param jsonInput - Raw JSON string containing security report data
   */
  const handleJsonParse = (jsonInput: string) => {
    setLoading(true);
    setError("");
    setUploadTimestamp(new Date());
    setRecentFileName(undefined); // No filename for pasted JSON

    try {
      const jsonData = JSON.parse(jsonInput);

      // Parse the security report using the appropriate parser
      const parsed = ReportParser.parse(jsonData);
      setResults(parsed.results);
      setSummary(parsed.summary);

      // Show report view with smooth animation
      setShowReport(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? `Failed to parse JSON: ${err.message}`
          : "Failed to parse JSON. Please ensure it's valid SARIF, Semgrep, or GitLab SAST JSON.",
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles navigation back to the landing page from report view
   * Preserves report data so users can view it again
   */
  const handleBackToUpload = () => {
    // Navigate back to landing page
    setShowReport(false);
  };

  /**
   * Handles viewing the recent report again
   */
  const handleViewRecentReport = () => {
    if (summary && results.length > 0) {
      // Show report view with smooth animation
      setShowReport(true);
    }
  };

  /**
   * Handles clearing the recent report data
   */
  const handleClearRecentReport = () => {
    setIsRemovingReport(true);
    // Wait for animation to complete before clearing data
    setTimeout(() => {
      setResults([]);
      setSummary(null);
      setError("");
      setUploadTimestamp(null);
      setRecentFileName(undefined);
      setIsRemovingReport(false);
    }, 400); // Match animation duration
  };

  // Always render both views with AnimatePresence for smooth transitions
  return (
    <>
      {/* Centered Loader Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center"
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
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
              <p className="text-white text-lg font-medium">
                Loading report...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {!showReport ? (
          <motion.div
            key="landing"
            className="fixed inset-0"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <LandingPage
              onFileUpload={handleFileUpload}
              onJsonParse={handleJsonParse}
              loading={loading}
              error={error}
              recentReport={
                summary && uploadTimestamp && !isRemovingReport
                  ? {
                      fileName: recentFileName,
                      timestamp: uploadTimestamp,
                      totalFindings: summary.totalFindings,
                      criticalCount: summary.criticalCount,
                      highCount: summary.highCount,
                    }
                  : undefined
              }
              onViewRecentReport={handleViewRecentReport}
              onClearRecentReport={handleClearRecentReport}
            />
          </motion.div>
        ) : (
          summary && (
            <motion.div
              key="report"
              className="fixed inset-0 min-h-screen w-screen report-scrollbar"
              style={{
                background:
                  "linear-gradient(to bottom right, #0f172a, #1e293b 80%)",
                overflowY: "auto",
              }}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <ReportView
                results={results}
                summary={summary}
                onBack={handleBackToUpload}
                uploadTimestamp={uploadTimestamp}
              />
            </motion.div>
          )
        )}
      </AnimatePresence>

      <style>
        {`
          /* Custom scrollbar hiding for landing page */
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
    </>
  );
}

export default App;
