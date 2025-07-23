import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield,
  Upload,
  FileText,
  Sparkles,
  Zap,
  Eye,
  Download,
  AlertCircle,
  CheckCircle,
  Copy,
  FileCode,
  Github,
  ArrowRight,
} from "lucide-react";

type LandingPageProps = {
  onFileUpload: (file: File) => void;
  onJsonParse: (json: string) => void;
  loading: boolean;
  error?: string;
  recentReport?: {
    fileName?: string;
    timestamp: Date;
    totalFindings: number;
    criticalCount: number;
    highCount: number;
  };
  onViewRecentReport?: () => void;
  onClearRecentReport?: () => void;
};

export const LandingPage: React.FC<LandingPageProps> = ({
  onFileUpload,
  onJsonParse,
  loading,
  error,
  recentReport,
  onViewRecentReport,
  onClearRecentReport,
}) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [inputMode, setInputMode] = useState<"upload" | "paste">("upload");
  const [dragActive, setDragActive] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus textarea when switching to paste mode
  useEffect(() => {
    if (inputMode === "paste" && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [inputMode]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      if (
        x < rect.left ||
        x >= rect.right ||
        y < rect.top ||
        y >= rect.bottom
      ) {
        setDragActive(false);
      }
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        if (file.type === "application/json" || file.name.endsWith(".json")) {
          onFileUpload(file);
        } else {
          setJsonError("Please upload a JSON file");
        }
      }
    },
    [onFileUpload],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        onFileUpload(e.target.files[0]);
        // Reset the input to allow selecting the same file again
        e.target.value = "";
      }
    },
    [onFileUpload],
  );

  const handleParse = () => {
    setJsonError("");
    if (!jsonInput.trim()) {
      setJsonError("Please paste JSON content");
      return;
    }
    try {
      JSON.parse(jsonInput);
      onJsonParse(jsonInput);
    } catch (err) {
      setJsonError("Invalid JSON format. Please check your input.");
    }
  };

  const handleCopy = async () => {
    if (jsonInput && navigator.clipboard) {
      await navigator.clipboard.writeText(jsonInput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const features = [
    {
      icon: Zap,
      title: "Rapid Analysis",
      description: "Process security reports with enterprise-grade performance",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-500",
      hoverBg: "hover:bg-blue-500/20",
    },
    {
      icon: Eye,
      title: "Comprehensive Insights",
      description: "Interactive dashboards for vulnerability assessment",
      color: "from-emerald-500 to-green-500",
      bgColor: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
      hoverBg: "hover:bg-emerald-500/20",
    },
    {
      icon: Download,
      title: "Report Generation",
      description: "Export detailed HTML reports for stakeholder review",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-500",
      hoverBg: "hover:bg-purple-500/20",
    },
  ];

  const supportedFormats = [
    { name: "SARIF", version: "v2.1.0", icon: FileCode },
    { name: "Semgrep", version: "JSON", icon: Shield },
    { name: "GitLab SAST", version: "JSON", icon: Shield },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top Navigation */}
        <nav className="flex justify-between items-center px-6 py-4 lg:px-12">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg backdrop-blur-sm border border-white/10">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="font-semibold text-white hidden sm:inline">
              Security Report Viewer
            </span>
          </div>
          <div className="flex gap-4">
            <a
              href="https://github.com/ICF-Next-Government/ngd-security-report-viewer"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-white/10 transition-all duration-200 group"
              aria-label="View on GitHub"
            >
              <Github className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            </a>
          </div>
        </nav>

        {/* Main Content */}
        <motion.div className="flex-1 flex items-center justify-center px-6 py-8">
          <motion.div className="grid lg:grid-cols-2 gap-12 max-w-7xl w-full items-center">
            {/* Left Side - Hero Content */}
            <motion.div
              className="order-2 lg:order-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="max-w-lg">
                <motion.div
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full border border-white/10 mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-blue-300">
                    Enterprise Security Analysis Platform
                  </span>
                </motion.div>

                <motion.h1
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Security Report
                  <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Analysis Portal
                  </span>
                </motion.h1>

                <motion.p
                  className="text-lg text-slate-300 mb-8 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  Centralized platform for analyzing SARIF, Semgrep, and GitLab
                  SAST security reports. Generate comprehensive insights and
                  detailed visualizations for vulnerability assessment and
                  remediation tracking.
                </motion.p>

                {/* Feature Pills */}
                <motion.div
                  className="flex flex-wrap gap-4 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className={`inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 transition-all duration-200 ${feature.hoverBg} hover:border-white/20 cursor-default`}
                    >
                      <feature.icon
                        className={`w-4 h-4 ${feature.iconColor}`}
                      />
                      <span className="text-sm text-white">
                        {feature.title}
                      </span>
                    </div>
                  ))}
                </motion.div>

                {/* Supported Formats */}
                <div className="flex items-center gap-2 text-sm text-slate-400 mt-6">
                  <FileCode className="w-4 h-4" />
                  <span>Supports:</span>
                  <div className="flex items-center gap-2">
                    {supportedFormats.map((format, index) => (
                      <span
                        key={index}
                        className="text-slate-300 flex items-center"
                      >
                        {format.name}
                        {index < supportedFormats.length - 1 && (
                          <span className="mx-2 text-slate-500 select-none">
                            |
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Upload Card */}
            <motion.div
              className="order-1 lg:order-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.div
                className="relative"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* Glow effect */}
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-20"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.3, 0.2],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Upload Card */}
                <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                  {/* Tab Selector */}
                  <div className="flex border-b border-white/10">
                    <button
                      onClick={() => setInputMode("upload")}
                      className={`flex-1 px-6 py-4 font-medium transition-all duration-200 relative ${
                        inputMode === "upload"
                          ? "text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                      disabled={loading}
                    >
                      <Upload className="w-4 h-4 inline-block mr-2" />
                      Upload File
                      {inputMode === "upload" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300" />
                      )}
                    </button>
                    <button
                      onClick={() => setInputMode("paste")}
                      className={`flex-1 px-6 py-4 font-medium transition-all duration-200 relative ${
                        inputMode === "paste"
                          ? "text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                      disabled={loading}
                    >
                      <FileText className="w-4 h-4 inline-block mr-2" />
                      Paste JSON
                      {inputMode === "paste" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300" />
                      )}
                    </button>
                  </div>

                  {/* Content Area */}
                  <div className="p-8 min-h-[380px] flex items-center">
                    <div className="w-full">
                      {inputMode === "upload" ? (
                        <div
                          className={`relative rounded-xl border-2 border-dashed transition-all duration-300 ${
                            dragActive
                              ? "border-blue-400 bg-blue-500/10"
                              : "border-white/20 hover:border-white/30"
                          } ${loading ? "opacity-50 pointer-events-none" : ""}`}
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDrag}
                          onDrop={handleDrop}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json,application/json"
                            onChange={handleFileSelect}
                            className="sr-only"
                            disabled={loading}
                          />

                          <div className="p-12 text-center">
                            <div
                              className={`inline-flex p-4 rounded-full mb-6 transition-all duration-300 ${
                                dragActive
                                  ? "bg-blue-500/20 scale-110"
                                  : "bg-white/10"
                              }`}
                            >
                              {loading ? (
                                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Upload
                                  className={`w-10 h-10 transition-colors duration-300 ${
                                    dragActive
                                      ? "text-blue-400"
                                      : "text-slate-400"
                                  }`}
                                />
                              )}
                            </div>

                            <h3 className="text-lg font-semibold text-white mb-2">
                              {loading
                                ? "Processing security report..."
                                : "Select Security Report"}
                            </h3>

                            <p className="text-slate-400 mb-6">
                              Drop file or{" "}
                              <button
                                onClick={() => fileInputRef.current?.click()}
                                className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200 hover:underline underline-offset-2"
                                disabled={loading}
                              >
                                browse for file
                              </button>
                            </p>

                            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                              <FileText className="w-3 h-3" />
                              <span>
                                Supported: JSON format • Maximum file size: 50MB
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="relative">
                            <textarea
                              ref={textareaRef}
                              value={jsonInput}
                              onChange={(e) => setJsonInput(e.target.value)}
                              placeholder='{"version": "2.1.0", "runs": [...] }'
                              className="w-full h-[240px] px-4 py-3 bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-lg text-white font-mono text-sm placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all duration-200 resize-none"
                              spellCheck={false}
                              disabled={loading}
                            />

                            <button
                              onClick={handleCopy}
                              className="absolute top-3 right-3 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 group"
                              disabled={!jsonInput || loading}
                            >
                              {copied ? (
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Copy className="w-4 h-4 text-slate-400 group-hover:text-white" />
                              )}
                            </button>
                          </div>

                          <div className="mt-6">
                            <button
                              onClick={handleParse}
                              disabled={loading || !jsonInput.trim()}
                              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-500 disabled:hover:to-purple-500 flex items-center justify-center gap-2 group"
                            >
                              {loading ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  Parsing...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-4 h-4" />
                                  Generate Report
                                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Error Display */}
                  <AnimatePresence>
                    {(error || jsonError) && (
                      <motion.div
                        className="mx-8 -mt-2 mb-6 p-4 bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-lg flex items-start gap-3"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-red-300 mb-1">
                            Error
                          </h4>
                          <p className="text-sm text-red-400">
                            {error || jsonError}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Recent Report Card */}
                <AnimatePresence>
                  {recentReport && onViewRecentReport && (
                    <motion.div
                      className="mt-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      <div className="relative bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:bg-slate-800/50 hover:border-slate-600 transition-all duration-200 group">
                        {/* Clear button */}
                        {onClearRecentReport && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsRemoving(true);
                              setTimeout(() => {
                                onClearRecentReport();
                                setIsRemoving(false);
                              }, 400);
                            }}
                            className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                            title="Clear recent report"
                          >
                            <svg
                              className="w-4 h-4"
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
                          </button>
                        )}

                        <button
                          onClick={onViewRecentReport}
                          className="w-full text-left"
                        >
                          <div className="pr-12">
                            <div className="flex items-center gap-2 mb-3">
                              <FileText className="w-5 h-5 text-blue-400" />
                              <h3 className="text-lg font-semibold text-white">
                                Recent Report
                              </h3>
                            </div>

                            <div className="space-y-2">
                              {recentReport.fileName && (
                                <p className="text-sm text-slate-400 truncate">
                                  {recentReport.fileName}
                                </p>
                              )}

                              <div className="flex items-center gap-4 text-sm">
                                <span className="text-slate-500">
                                  {recentReport.timestamp.toLocaleString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    },
                                  )}
                                </span>

                                <span className="text-slate-300">
                                  {recentReport.totalFindings} findings
                                </span>
                              </div>

                              {(recentReport.criticalCount > 0 ||
                                recentReport.highCount > 0) && (
                                <div className="flex items-center gap-3 mt-3">
                                  {recentReport.criticalCount > 0 && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-red-900/30 text-red-300 text-xs font-medium">
                                      {recentReport.criticalCount} Critical
                                    </span>
                                  )}
                                  {recentReport.highCount > 0 && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-orange-900/30 text-orange-300 text-xs font-medium">
                                      {recentReport.highCount} High
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom Footer */}
        <footer className="mt-auto py-6 px-6 lg:px-12 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} ICF Security Report Viewer
            </p>
            <div className="flex gap-6">
              <a
                href="mailto:support@icf.com"
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Support
              </a>
              <a
                href="https://sarifweb.azurewebsites.net/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                SARIF Spec
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="text-center"
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
                Analyzing security report...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
