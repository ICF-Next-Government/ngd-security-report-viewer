import React, { useState, useEffect } from "react";
import { FileUpload } from "./components/FileUpload";
import { ReportView } from "./components/ReportView";
import { SarifParser } from "./utils/sarifParser";
import { ProcessedResult, ReportSummary, SarifLog } from "./types/sarif";
import {
  Shield,
  Zap,
  Eye,
  Download,
  FileText,
  AlertCircle,
} from "lucide-react";

function App() {
  const [results, setResults] = useState<ProcessedResult[]>([]);
  const [summary, setSummary] = useState<ReportSummary | null>(null);
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

  // Toggle for file upload vs paste JSON
  const [usePaste, setUsePaste] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [jsonInputError, setJsonInputError] = useState<string>("");

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setError("");
    setUploadTimestamp(new Date());

    try {
      const fileContent = await file.text();
      const sarifData: SarifLog = JSON.parse(fileContent);

      // Validate basic SARIF structure
      if (!sarifData.runs || !Array.isArray(sarifData.runs)) {
        throw new Error(
          'Invalid SARIF format: Missing or invalid "runs" array',
        );
      }

      const parsed = SarifParser.parse(sarifData);
      setResults(parsed.results);
      setSummary(parsed.summary);

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
          ? `Failed to parse SARIF file: ${err.message}`
          : "Failed to parse SARIF file. Please ensure it's a valid JSON file.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasteParse = () => {
    setLoading(true);
    setJsonInputError("");
    setUploadTimestamp(new Date());

    try {
      const sarifData: SarifLog = JSON.parse(jsonInput);

      if (!sarifData.runs || !Array.isArray(sarifData.runs)) {
        throw new Error(
          'Invalid SARIF format: Missing or invalid "runs" array',
        );
      }

      const parsed = SarifParser.parse(sarifData);
      setResults(parsed.results);
      setSummary(parsed.summary);

      // Animate transition to report
      setTransitioning(true);
      setPendingShowReport(true);
      setTimeout(() => {
        setShowReport(true);
        setTransitioning(false);
        setPendingShowReport(null);
      }, 350);
    } catch (err) {
      setJsonInputError(
        err instanceof Error
          ? `Failed to parse SARIF JSON: ${err.message}`
          : "Failed to parse SARIF JSON. Please ensure it's valid JSON.",
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
      setError("");
      setUploadTimestamp(null);
      setJsonInput("");
      setJsonInputError("");
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
    <div
      className={`min-h-screen transition-opacity duration-300 no-scrollbar ${
        transitioning && pendingShowReport === false
          ? "animate-fade-out-black"
          : "animate-fade-in"
      }`}
      style={{
        background: "linear-gradient(to bottom right, #0f172a, #1e293b 80%)",
        opacity: transitioning && pendingShowReport ? 0 : 1,
        pointerEvents: transitioning && pendingShowReport ? "none" : undefined,
        overflow: "auto",
      }}
    >
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <div className="p-2 bg-blue-600 rounded-xl shadow-lg">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              SARIF Report Viewer
            </h1>
          </div>

          <p className="text-lg text-slate-300 mb-4 max-w-2xl mx-auto">
            A modern, beautiful SARIF JSON report viewer for Semgrep, CodeQL,
            and more.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700 shadow-lg">
              <div className="p-2 bg-blue-500/20 rounded-lg w-fit mx-auto mb-4">
                <Zap className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Fast Parsing
              </h3>
              <p className="text-slate-400 text-sm">
                Instantly parse and analyze SARIF files from Semgrep and other
                security tools
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700 shadow-lg">
              <div className="p-2 bg-green-500/20 rounded-lg w-fit mx-auto mb-4">
                <Eye className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Rich Visualization
              </h3>
              <p className="text-slate-400 text-sm">
                Beautiful dashboards with severity breakdowns and detailed
                finding views
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700 shadow-lg">
              <div className="p-2 bg-purple-500/20 rounded-lg w-fit mx-auto mb-4">
                <Download className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Export Reports
              </h3>
              <p className="text-slate-400 text-sm">
                Export findings as a static HTML file for further analysis and
                reporting
              </p>
            </div>
          </div>
        </div>

        {/* Toggle for upload vs paste */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex rounded-lg bg-slate-800/50 border border-slate-700 shadow overflow-hidden">
            <button
              className={`px-4 py-1.5 text-sm font-medium focus:outline-none transition-colors ${
                !usePaste
                  ? "bg-blue-600 text-white"
                  : "bg-transparent text-slate-300 hover:bg-slate-700/50"
              }`}
              onClick={() => setUsePaste(false)}
              disabled={loading || !usePaste}
              type="button"
            >
              Upload File
            </button>
            <button
              className={`px-4 py-1.5 text-sm font-medium focus:outline-none transition-colors ${
                usePaste
                  ? "bg-blue-600 text-white"
                  : "bg-transparent text-slate-300 hover:bg-slate-700/50"
              }`}
              onClick={() => setUsePaste(true)}
              disabled={loading || usePaste}
              type="button"
            >
              Paste JSON
            </button>
          </div>
        </div>

        {/* Upload or Paste Component with smooth transition, no overlap, and no layout shift */}
        <div className="relative w-full max-w-2xl mx-auto h-[440px] flex items-stretch">
          {usePaste ? (
            <div
              key="paste"
              className="w-full h-full transition-all duration-500 ease-in-out animate-fade-in-panel flex"
            >
              <div className="bg-slate-800/50 border-2 border-dashed border-slate-600 rounded-xl py-1.5 px-8 text-center shadow-lg backdrop-blur-sm h-full flex flex-col justify-center w-full">
                <div className="flex flex-col items-center space-y-3 w-full">
                  <div className="p-3 rounded-full bg-slate-700/50">
                    <FileText className="h-7 w-7 text-slate-400" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-white">
                      Paste SARIF JSON
                    </h3>
                    <p className="text-slate-300 text-sm">
                      Paste your Semgrep SARIF JSON content below to generate a
                      report.
                    </p>
                    <p className="text-xs text-slate-400">
                      Supports SARIF v2.1.0 format from Semgrep and other tools.
                    </p>
                  </div>
                  <div className="relative w-full">
                    <textarea
                      ref={(el) => {
                        // Auto-focus and select on panel open
                        if (el && usePaste) {
                          setTimeout(() => {
                            el.focus();
                            el.select();
                          }, 100);
                        }
                      }}
                      className="w-full min-h-[120px] rounded-lg bg-slate-900/80 border border-slate-700 text-slate-100 p-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      placeholder="Paste SARIF JSON here..."
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                      disabled={loading}
                      spellCheck={false}
                    />
                    <button
                      className="absolute top-2 right-2 px-2 py-1 rounded bg-slate-700 text-slate-200 text-xs hover:bg-blue-600 transition"
                      type="button"
                      aria-label="Copy JSON to clipboard"
                      onClick={() => {
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(jsonInput);
                        }
                      }}
                      disabled={!jsonInput.trim()}
                    >
                      Copy
                    </button>
                  </div>
                  <button
                    className="mt-1 px-4 py-1.5 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition disabled:opacity-50"
                    onClick={handlePasteParse}
                    disabled={loading || !jsonInput.trim()}
                    type="button"
                  >
                    {loading ? "Parsing..." : "Parse JSON"}
                  </button>
                  {jsonInputError && (
                    <div className="mt-1 p-2 bg-red-900/50 border border-red-700 rounded-lg flex items-start space-x-3 backdrop-blur-sm w-full text-left">
                      <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-red-300">
                          Parse Error
                        </h4>
                        <p className="text-sm text-red-400 mt-1">
                          {jsonInputError}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div
              key="upload"
              className="w-full h-full transition-all duration-500 ease-in-out animate-fade-in-panel flex"
            >
              <div className="w-full h-full flex flex-col justify-center">
                <FileUpload
                  onFileUpload={handleFileUpload}
                  loading={loading}
                  error={error}
                />
              </div>
            </div>
          )}
        </div>
        <style>
          {`
            @keyframes fadeInPanel {
              from { opacity: 0; transform: translateY(24px);}
              to { opacity: 1; transform: none;}
            }
            .animate-fade-in-panel {
              animation: fadeInPanel 0.5s;
            }
          `}
        </style>

        {/* Animated loading spinner overlay */}
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-white text-lg font-semibold">
                Parsing...
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-12 text-sm text-slate-400 border-t border-slate-700 pt-8">
          <p>
            Supports SARIF v2.1.0 format • Compatible with Semgrep, CodeQL, and
            other SARIF-compliant tools
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <a
              href="https://github.com/ICF-Next-Government/icf-sarif-viewer"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors underline"
            >
              GitHub
            </a>
            <a
              href="mailto:support@icf.com"
              className="hover:text-blue-400 transition-colors underline"
            >
              Support
            </a>
            <a
              href="https://sarifweb.azurewebsites.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors underline"
            >
              SARIF Spec
            </a>
          </div>
          <div className="mt-4 text-xs text-slate-500">
            &copy; {new Date().getFullYear()} ICF SARIF Viewer
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
