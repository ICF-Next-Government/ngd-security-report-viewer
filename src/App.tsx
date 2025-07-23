import { useState, useEffect } from "react";
import { LandingPage } from "@/components/LandingPage";
import { ReportView } from "@/components/ReportView";
import { ProcessedResult, ReportSummary } from "@/types/report";
import { ReportParser } from "@/utils/reportParser";

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

  // Animation state for smooth transitions between views
  const [transitioning, setTransitioning] = useState(false);
  const [pendingShowReport, setPendingShowReport] = useState<boolean | null>(
    null,
  );

  /**
   * Manages document scrollbar visibility based on the current view
   * - Report view: Hidden overflow (report has its own scrolling)
   * - Landing page: Auto overflow with hidden scrollbar (custom styling)
   */
  useEffect(() => {
    if (showReport || (transitioning && pendingShowReport)) {
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
  }, [showReport, transitioning, pendingShowReport]);

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

      // Trigger smooth transition animation to report view
      setTransitioning(true);
      setPendingShowReport(true);
      setTimeout(() => {
        setShowReport(true);
      }, 50);
      setTimeout(() => {
        setTransitioning(false);
        setPendingShowReport(null);
      }, 550); // Allow transition to complete
    } catch (err) {
      console.error("Parse error:", err);
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

      // Trigger smooth transition animation to report view
      setTransitioning(true);
      setPendingShowReport(true);
      setTimeout(() => {
        setShowReport(true);
      }, 50);
      setTimeout(() => {
        setTransitioning(false);
        setPendingShowReport(null);
      }, 550); // Allow transition to complete
    } catch (err) {
      console.error("Parse error:", err);
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
    // Start fade-out animation
    setTransitioning(true);
    setPendingShowReport(false);
    setShowReport(false);

    setTimeout(() => {
      // Only clear transition state, keep report data
      setTransitioning(false);
      setPendingShowReport(null);
    }, 550); // Allow transition to complete
  };

  /**
   * Handles viewing the recent report again
   */
  const handleViewRecentReport = () => {
    if (summary && results.length > 0) {
      // Use same transition animation as file upload
      setTransitioning(true);
      setPendingShowReport(true);
      setTimeout(() => {
        setShowReport(true);
      }, 50);
      setTimeout(() => {
        setTransitioning(false);
        setPendingShowReport(null);
      }, 550); // Allow transition to complete
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

  // Always render both views, control visibility with CSS
  return (
    <>
      {/* Landing Page Layer */}
      <div
        className={`fixed inset-0 transition-all duration-500 ${
          showReport || transitioning
            ? "opacity-0 pointer-events-none"
            : "opacity-100"
        }`}
        style={{
          transform: showReport || transitioning ? "scale(0.95)" : "scale(1)",
        }}
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
      </div>

      {/* Report View Layer */}
      {summary && (
        <div
          className={`fixed inset-0 min-h-screen w-screen report-scrollbar transition-all duration-500 ${
            showReport && !transitioning
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
          style={{
            background:
              "linear-gradient(to bottom right, #0f172a, #1e293b 80%)",
            overflowY: "auto",
            transform:
              showReport && !transitioning ? "scale(1)" : "scale(1.05)",
          }}
        >
          <ReportView
            results={results}
            summary={summary}
            onBack={handleBackToUpload}
            uploadTimestamp={uploadTimestamp}
          />
        </div>
      )}

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
