import React, { useState } from "react";
import { FileUpload } from "./components/FileUpload";
import { ReportView } from "./components/ReportView";
import { SarifParser } from "./utils/sarifParser";
import { ProcessedResult, ReportSummary, SarifLog } from "./types/sarif";
import { Shield, Zap, Eye, Download } from "lucide-react";

function App() {
  const [results, setResults] = useState<ProcessedResult[]>([]);
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showReport, setShowReport] = useState(false);
  const [uploadTimestamp, setUploadTimestamp] = useState<Date | null>(null);

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
      setShowReport(true);
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

  const handleBackToUpload = () => {
    setShowReport(false);
    setResults([]);
    setSummary(null);
    setError("");
    setUploadTimestamp(null);
  };

  if (showReport && summary) {
    return (
      <ReportView
        results={results}
        summary={summary}
        onBack={handleBackToUpload}
        uploadTimestamp={uploadTimestamp}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
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

        {/* Upload Component */}
        <FileUpload
          onFileUpload={handleFileUpload}
          loading={loading}
          error={error}
        />

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-slate-400">
          <p>
            Supports SARIF v2.1.0 format • Compatible with Semgrep, CodeQL, and
            other SARIF-compliant tools
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
