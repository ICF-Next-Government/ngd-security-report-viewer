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
        setTransitioning(false);
        setPendingShowReport(null);
      }, 350); // 350ms matches the CSS animation duration
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
        setTransitioning(false);
        setPendingShowReport(null);
      }, 350); // 350ms matches the CSS animation duration
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
   * Clears all report data and resets the application state
   */
  const handleBackToUpload = () => {
    // Start fade-out animation
    setTransitioning(true);
    setPendingShowReport(false);
    setTimeout(() => {
      // Clear all report data after animation completes
      setShowReport(false);
      setResults([]);
      setSummary(null);

      setError("");
      setUploadTimestamp(null);
      setTransitioning(false);
      setPendingShowReport(null);
    }, 350); // 350ms matches the CSS animation duration
  };

  // Determine which animation class to apply based on transition state
  const fadeClass = transitioning
    ? pendingShowReport
      ? "animate-fade-in"
      : "animate-fade-out-black"
    : "";

  // Render report view if we have data and are in the right state
  if ((showReport || (transitioning && pendingShowReport)) && summary) {
    return (
      <div
        className={`fixed inset-0 min-h-screen w-screen transition-opacity duration-300 report-scrollbar ${fadeClass}`}
        style={{
          background: "linear-gradient(to bottom right, #0f172a, #1e293b 80%)",
          opacity: transitioning && !pendingShowReport ? 1 : 1,
          pointerEvents:
            transitioning && !pendingShowReport ? "none" : undefined,
          overflowY: "auto",
          zIndex: 10,
        }}
      >
        <ReportView
          results={results}
          summary={summary}
          onBack={handleBackToUpload}
          uploadTimestamp={uploadTimestamp}
        />
        <style>
          {`
            /* Fade in animation for report view entrance */
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(16px);}
              to { opacity: 1; transform: none;}
            }
            /* Fade to black animation for report view exit */
            @keyframes fadeOutBlack {
              0% {
                opacity: 1;
                filter: brightness(1);
                background: #0f172a;
              }
              70% {
                opacity: 0;
                filter: brightness(0.2);
                background: #0f172a;
              }
              100% {
                opacity: 0;
                filter: brightness(0);
                background: #0f172a;
              }
            }
            .animate-fade-in {
              animation: fadeIn 0.35s;
            }
            .animate-fade-out-black {
              animation: fadeOutBlack 0.35s forwards;
            }
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
      </div>
    );
  }

  // Render landing page by default
  return (
    <>
      {/* Overlay for fade-out animation when leaving landing page */}
      {transitioning && pendingShowReport === false && (
        <div
          className="fixed inset-0 z-50 animate-fade-out-black"
          style={{
            background:
              "linear-gradient(to bottom right, #0f172a, #1e293b 80%)",
          }}
        />
      )}

      <LandingPage
        onFileUpload={handleFileUpload}
        onJsonParse={handleJsonParse}
        loading={loading}
        error={error}
      />
    </>
  );
}

export default App;
