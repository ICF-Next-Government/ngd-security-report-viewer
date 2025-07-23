/**
 * Core type definitions for the security report viewer
 *
 * These types provide a unified interface for handling multiple security
 * report formats (SARIF, Semgrep, GitLab SAST) in a consistent manner.
 */

/**
 * Supported security report formats
 */
export type ReportFormat = "sarif" | "semgrep" | "gitlab-sast";

/**
 * View modes for the findings list
 * - "all": Shows all individual findings
 * - "deduplicated": Groups similar findings together
 */
export type ViewMode = "all" | "deduplicated";

/**
 * Unified report structure that normalizes different report formats
 * into a consistent interface for the application
 */
export type UnifiedReport = {
  /** The original format of the security report */
  format: ReportFormat;
  /** Array of processed security findings */
  results: ProcessedResult[];
  /** Summary statistics and metadata */
  summary: ReportSummary;
  /** Original parsed data for reference */
  rawData: any;
};

/**
 * Represents a single security finding after processing
 *
 * This type normalizes findings from different tools into a consistent format
 * that can be displayed and filtered uniformly in the UI
 */
export type ProcessedResult = {
  /** Unique identifier for this finding instance */
  id: string;
  /** Rule/check identifier from the security tool */
  ruleId: string;
  /** Human-readable name of the rule */
  ruleName: string;
  /** Main message describing the finding */
  message: string;
  /** Normalized severity level */
  severity: "critical" | "high" | "medium" | "low" | "info";
  /** Original severity level from the tool (for reference) */
  level: string;
  /** File path where the issue was found */
  file: string;
  /** Starting line number (1-based) */
  startLine?: number;
  /** Ending line number (1-based) */
  endLine?: number;
  /** Starting column number (1-based) */
  startColumn?: number;
  /** Ending column number (1-based) */
  endColumn?: number;
  /** Code snippet showing the issue context */
  snippet?: string;
  /** Detailed description of the issue and potential fix */
  description?: string;
  /** Categorization tags (e.g., "security", "performance") */
  tags: string[];
  /** Additional tool-specific metadata */
  metadata?: Record<string, any>;
};

/**
 * Summary statistics and metadata for a security report
 *
 * Contains aggregate information about the findings and tool metadata
 * for display in the report summary section
 */
export type ReportSummary = {
  /** Total number of findings in the report */
  totalFindings: number;
  /** Number of critical severity findings */
  criticalCount: number;
  /** Number of high severity findings */
  highCount: number;
  /** Number of medium severity findings */
  mediumCount: number;
  /** Number of low severity findings */
  lowCount: number;
  /** Number of informational findings */
  infoCount: number;
  /** Severity counts in object form (for easier access) */
  severityCounts: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  /** Number of unique files with findings */
  filesAffected: number;
  /** Name of the security scanning tool */
  toolName: string;
  /** Version of the security scanning tool */
  toolVersion?: string;
  /** ISO timestamp for when the report was uploaded/viewed */
  timestamp?: string;
  /** Original format of the report */
  format: ReportFormat;
};
