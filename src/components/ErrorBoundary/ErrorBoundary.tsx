import { AlertTriangle, CheckCircle, Copy, Home, RefreshCw } from "lucide-react";
import { type ReactNode, useState } from "react";
import { type FallbackProps, ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

export function ErrorBoundary({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <ReactErrorBoundary
      FallbackComponent={fallback ? () => <>{fallback}</> : ErrorFallback}
      onReset={() => window.location.reload()}
    >
      {children}
    </ReactErrorBoundary>
  );
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const fullError = `Error: ${error.toString()}\n\nStack Trace:\n${error.stack || "No stack trace available"}`;
    navigator.clipboard.writeText(fullError).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-red-700/50 shadow-2xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-red-900/50 rounded-full">
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
              <p className="text-slate-400 mt-1">
                An unexpected error occurred while rendering this page
              </p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-red-300">Error Details</h2>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded transition-colors duration-200"
                title="Copy full error details"
              >
                {copied ? (
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
              <p className="text-red-400 font-mono text-sm mb-2">{error.toString()}</p>
              {error.stack && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-slate-400 hover:text-slate-300 text-sm">
                    Show stack trace
                  </summary>
                  <div className="mt-2">
                    <pre className="text-xs text-slate-500 overflow-auto max-h-64 bg-slate-900 p-3 rounded">
                      {error.stack}
                    </pre>
                  </div>
                </details>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={resetErrorBoundary}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Try Again</span>
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Reload Page</span>
            </button>
            <button
              onClick={() => {
                window.location.href = "/";
              }}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200"
            >
              <Home className="h-4 w-4" />
              <span>Go Home</span>
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
            <p className="text-sm text-blue-300">
              <strong>Tip:</strong> If this error persists, try clearing your browser cache or using
              a different browser. You can also report this issue to the development team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook for using error boundary in functional components
export function useErrorHandler() {
  const [error, setError] = useState<Error | null>(null);

  // Throw error to trigger ErrorBoundary
  if (error) throw error;

  return setError;
}
