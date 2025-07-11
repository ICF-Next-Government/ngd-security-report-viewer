import React, { useState, useEffect } from "react";
import { LandingPage } from "./components/LandingPage";
import { ReportView } from "./components/ReportView";
import { ProcessedResult, ReportSummary, UnifiedReport } from "./types/report";
import { ReportParser } from "./utils/reportParser";

function App() {
  const [results, setResults] = useState<ProcessedResult[]>([]);
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [report, setReport] = useState<UnifiedReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showReport, setShowReport] = useState(false);
  const [uploadTimestamp, setUploadTimestamp] = useState<Date | null>(null);

  // For animated transitions
  const [transitioning, setTransitioning] = useState(false);
  const [pendingShowReport, setPendingShowReport] = useState<boolean | null>(
    null,
  );

  // Hide html/body scrollbars on report, but allow scrolling (hidden scrollbar) on home
  useEffect(() => {
    if (showReport || (transitioning && pendingShowReport)) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.documentElement.classList.remove("no-scrollbar");
      document.body.classList.remove("no-scrollbar");
    } else {
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
      document.documentElement.classList.add("no-scrollbar");
      document.body.classList.add("no-scrollbar");
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.documentElement.classList.remove("no-scrollbar");
      document.body.classList.remove("no-scrollbar");
    };
  }, [showReport, transitioning, pendingShowReport]);

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setError("");
    setUploadTimestamp(new Date());

    try {
      const fileContent = await file.text();
      const jsonData = JSON.parse(fileContent);

      const parsed = ReportParser.parse(jsonData);
      setResults(parsed.results);
      setSummary(parsed.summary);
      setReport(parsed);

      // Animate transition to report
      setTransitioning(true);
      setPendingShowReport(true);
      setTimeout(() => {
        setShowReport(true);
        setTransitioning(false);
        setPendingShowReport(null);
      }, 350);
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

  const handleJsonParse = (jsonInput: string) => {
    setLoading(true);
    setError("");
    setUploadTimestamp(new Date());

    try {
      const jsonData = JSON.parse(jsonInput);

      const parsed = ReportParser.parse(jsonData);
      setResults(parsed.results);
      setSummary(parsed.summary);
      setReport(parsed);

      // Animate transition to report
      setTransitioning(true);
      setPendingShowReport(true);
      setTimeout(() => {
        setShowReport(true);
        setTransitioning(false);
        setPendingShowReport(null);
      }, 350);
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

  const handleBackToUpload = () => {
    // Animate transition back to home
    setTransitioning(true);
    setPendingShowReport(false);
    setTimeout(() => {
      setShowReport(false);
      setResults([]);
      setSummary(null);
      setReport(null);
      setError("");
      setUploadTimestamp(null);
      setTransitioning(false);
      setPendingShowReport(null);
    }, 350);
  };

  // Animation classes
  const fadeClass = transitioning
    ? pendingShowReport
      ? "animate-fade-in"
      : "animate-fade-out-black"
    : "";

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
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(16px);}
              to { opacity: 1; transform: none;}
            }
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
            /* Hide scrollbar for home page */
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

  return (
    <>
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
