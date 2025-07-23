import {
  AlertTriangle,
  Home,
  RefreshCw,
  Copy,
  CheckCircle,
} from "lucide-react";
import React, { Component, ErrorInfo, ReactNode, useState } from "react";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copiedStackTrace: boolean;
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      copiedStackTrace: false,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      copiedStackTrace: false,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      copiedStackTrace: false,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  handleCopyFullError = () => {
    if (this.state.error) {
      const fullError = `Error: ${this.state.error.toString()}\n\nStack Trace:\n${this.state.error.stack || "No stack trace available"}\n\nComponent Stack:\n${this.state.errorInfo?.componentStack || "No component stack available"}`;
      navigator.clipboard.writeText(fullError).then(() => {
        this.setState({ copiedStackTrace: true });
        setTimeout(() => {
          this.setState({ copiedStackTrace: false });
        }, 2000);
      });
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
          <div className="max-w-2xl w-full">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-red-700/50 shadow-2xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-red-900/50 rounded-full">
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Something went wrong
                  </h1>
                  <p className="text-slate-400 mt-1">
                    An unexpected error occurred while rendering this page
                  </p>
                </div>
              </div>

              {this.state.error && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold text-red-300">
                      Error Details
                    </h2>
                    <button
                      onClick={this.handleCopyFullError}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded transition-colors duration-200"
                      title="Copy full error details"
                    >
                      {this.state.copiedStackTrace ? (
                        <>
                          <CheckCircle className="h-3 w-3" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy Error</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                    <p className="text-red-400 font-mono text-sm mb-2">
                      {this.state.error.toString()}
                    </p>
                    {this.state.errorInfo && (
                      <details className="mt-4">
                        <summary className="cursor-pointer text-slate-400 hover:text-slate-300 text-sm">
                          Show stack trace
                        </summary>
                        <div className="mt-2">
                          <pre className="text-xs text-slate-500 overflow-auto max-h-64 bg-slate-900 p-3 rounded">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      </details>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={this.handleReset}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Try Again</span>
                </button>
                <button
                  onClick={this.handleReload}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Reload Page</span>
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200"
                >
                  <Home className="h-4 w-4" />
                  <span>Go Home</span>
                </button>
              </div>

              <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
                <p className="text-sm text-blue-300">
                  <strong>Tip:</strong> If this error persists, try clearing
                  your browser cache or using a different browser. You can also
                  report this issue to the development team.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for using error boundary in functional components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return setError;
}
