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

  // Always hide html/body scrollbars; only allow scrolling on report wrapper
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

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
        overflow: "hidden",
      }}
    >
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">
              SARIF Report Viewer
            </h1>
          </div>

          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Upload your Semgrep SARIF files to generate comprehensive security
            analysis reports with detailed findings, severity breakdowns, and
            actionable insights.
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
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg bg-slate-800/50 border border-slate-700 shadow overflow-hidden">
            <button
              className={`px-6 py-2 text-sm font-medium focus:outline-none transition-colors ${
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
              className={`px-6 py-2 text-sm font-medium focus:outline-none transition-colors ${
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

        {/* Upload or Paste Component */}
        {!usePaste ? (
          <FileUpload
            onFileUpload={handleFileUpload}
            loading={loading}
            error={error}
          />
        ) : (
          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-slate-800/50 border-2 border-dashed border-slate-600 rounded-xl p-8 text-center shadow-lg backdrop-blur-sm">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 rounded-full bg-slate-700/50">
                  <FileText className="h-8 w-8 text-slate-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-white">
                    Paste SARIF JSON
                  </h3>
                  <p className="text-slate-300">
                    Paste your Semgrep SARIF JSON content below to generate a
                    report.
                  </p>
                  <p className="text-sm text-slate-400">
                    Supports SARIF v2.1.0 format from Semgrep and other tools.
                  </p>
                </div>
                <textarea
                  className="w-full min-h-[180px] rounded-lg bg-slate-900/80 border border-slate-700 text-slate-100 p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Paste SARIF JSON here..."
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  disabled={loading}
                  spellCheck={false}
                />
                <button
                  className="mt-2 px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition disabled:opacity-50"
                  onClick={handlePasteParse}
                  disabled={loading || !jsonInput.trim()}
                  type="button"
                >
                  {loading ? "Parsing..." : "Parse JSON"}
                </button>
                {jsonInputError && (
                  <div className="mt-2 p-3 bg-red-900/50 border border-red-700 rounded-lg flex items-start space-x-3 backdrop-blur-sm w-full text-left">
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
          /* Stylish dark scrollbar for report page */
          .report-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #334155 #0f172a;
          }
          .report-scrollbar::-webkit-scrollbar {
            width: 12px;
            background: #0f172a;
          }
          .report-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #334155 40%, #1e293b 100%);
            border-radius: 8px;
            border: 2px solid #0f172a;
            min-height: 40px;
          }
          .report-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, #475569 40%, #334155 100%);
          }
          .report-scrollbar::-webkit-scrollbar-corner {
            background: #0f172a;
          }
        `}
      </style>
    </div>
  );
}

export default App;
