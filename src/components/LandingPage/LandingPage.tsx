import React, { useState, useCallback, useRef, useEffect } from "react";
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
  ArrowRight,
  Github,
  Mail,
  ExternalLink,
} from "lucide-react";

interface LandingPageProps {
  onFileUpload: (file: File) => void;
  onJsonParse: (json: string) => void;
  loading: boolean;
  error?: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onFileUpload,
  onJsonParse,
  loading,
  error,
}) => {
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
      title: "Lightning Fast",
      description: "Parse and analyze reports instantly",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-500",
    },
    {
      icon: Eye,
      title: "Beautiful Reports",
      description: "Interactive dashboards with detailed insights",
      color: "from-emerald-500 to-green-500",
      bgColor: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
    },
    {
      icon: Download,
      title: "Export & Share",
      description: "Generate static HTML reports for sharing",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-500",
    },
  ];

  const supportedFormats = [
    { name: "SARIF", version: "v2.1.0", icon: FileCode },
    { name: "Semgrep", version: "JSON", icon: Shield },
    { name: "GitLab SAST", version: "JSON", icon: Shield },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />

      <div className="relative z-10 container mx-auto px-4 py-6 lg:py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2.5 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl backdrop-blur-sm border border-white/10 mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight">
            Security Report
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {" "}
              Viewer
            </span>
          </h1>

          <p className="text-base md:text-lg text-slate-300 max-w-xl mx-auto">
            Transform your security scan results into beautiful, actionable
            insights. Support for SARIF, Semgrep, and GitLab SAST formats.
          </p>
        </header>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 transition-all duration-200 hover:bg-white/10 hover:border-white/20 hover:transform hover:-translate-y-0.5"
            >
              <div
                className={`inline-flex p-2.5 ${feature.bgColor} rounded-lg mb-3 transition-transform duration-200 group-hover:scale-110`}
              >
                <feature.icon className={`w-5 h-5 ${feature.iconColor}`} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-400">{feature.description}</p>
              <div
                className={`absolute inset-0 rounded-xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-200`}
              />
            </div>
          ))}
        </div>

        {/* Main Upload/Paste Section */}
        <div className="max-w-3xl mx-auto">
          {/* Mode Selector */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex p-1 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
              <button
                onClick={() => setInputMode("upload")}
                className={`px-5 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                  inputMode === "upload"
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
                disabled={loading}
              >
                <Upload className="w-4 h-4 inline-block mr-2" />
                Upload File
              </button>
              <button
                onClick={() => setInputMode("paste")}
                className={`px-5 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                  inputMode === "paste"
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
                disabled={loading}
              >
                <FileText className="w-4 h-4 inline-block mr-2" />
                Paste JSON
              </button>
            </div>
          </div>

          {/* Upload/Paste Container */}
          <div className="relative">
            {inputMode === "upload" ? (
              <div
                className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 ${
                  dragActive
                    ? "border-blue-400 bg-blue-500/10 shadow-2xl shadow-blue-500/20"
                    : "border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10"
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

                <div className="p-8 md:p-12 text-center">
                  <div
                    className={`inline-flex p-3 rounded-xl mb-4 transition-all duration-300 ${
                      dragActive ? "bg-blue-500/20 scale-110" : "bg-white/10"
                    }`}
                  >
                    {loading ? (
                      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload
                        className={`w-10 h-10 transition-colors duration-300 ${
                          dragActive ? "text-blue-400" : "text-slate-400"
                        }`}
                      />
                    )}
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-2">
                    {loading
                      ? "Processing your file..."
                      : "Drop your security report here"}
                  </h3>

                  <p className="text-slate-400 mb-4">
                    or{" "}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-400 hover:text-blue-300 underline underline-offset-4 font-medium"
                      disabled={loading}
                    >
                      browse files
                    </button>
                  </p>

                  <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                    <FileText className="w-4 h-4" />
                    <span>JSON files only • Max 50MB</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Paste your JSON content
                  </h3>
                  <p className="text-sm text-slate-400">
                    Copy and paste your security report JSON directly below
                  </p>
                </div>

                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder='{"version": "2.1.0", "runs": [...] }'
                    className="w-full h-48 px-4 py-3 bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-lg text-white font-mono text-sm placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all duration-200 resize-none"
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

                <div className="mt-4 flex items-center gap-4">
                  <button
                    onClick={handleParse}
                    disabled={loading || !jsonInput.trim()}
                    className="flex-1 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium text-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Error Display */}
          {(error || jsonError) && (
            <div className="mt-6 p-4 bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-red-300 mb-1">Error</h4>
                <p className="text-sm text-red-400">{error || jsonError}</p>
              </div>
            </div>
          )}

          {/* Supported Formats */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-400 mb-4">Supported formats</p>
            <div className="flex flex-wrap justify-center gap-4">
              {supportedFormats.map((format, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg"
                >
                  <format.icon className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-white font-medium">
                    {format.name}
                  </span>
                  <span className="text-xs text-slate-500">
                    {format.version}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-white/10">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-sm text-slate-400 mb-4">
              Built with security and privacy in mind. All processing happens
              locally in your browser.
            </p>

            <div className="flex flex-wrap justify-center gap-6 mb-6">
              <a
                href="https://github.com/ICF-Next-Government/ngd-security-report-viewer"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors duration-200"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
              <a
                href="mailto:support@icf.com"
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors duration-200"
              >
                <Mail className="w-4 h-4" />
                Support
              </a>
              <a
                href="https://sarifweb.azurewebsites.net/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors duration-200"
              >
                <ExternalLink className="w-4 h-4" />
                SARIF Specification
              </a>
            </div>

            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} ICF Security Report Viewer. All
              rights reserved.
            </p>
          </div>
        </footer>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-white text-lg font-medium">
              Analyzing security report...
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};
