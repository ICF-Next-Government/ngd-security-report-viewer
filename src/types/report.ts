// Unified types for handling both SARIF and Semgrep reports

export type ReportFormat = "sarif" | "semgrep" | "gitlab-sast";

export type UnifiedReport = {
  format: ReportFormat;
  results: ProcessedResult[];
  summary: ReportSummary;
  rawData: any; // Original parsed data
};

export type ProcessedResult = {
  id: string;
  ruleId: string;
  ruleName: string;
  message: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  level: string;
  file: string;
  startLine?: number;
  endLine?: number;
  startColumn?: number;
  endColumn?: number;
  snippet?: string;
  description?: string;
  tags: string[];
  metadata?: Record<string, any>;
};

export type ReportSummary = {
  totalFindings: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  infoCount: number;
  filesAffected: number;
  toolName: string;
  toolVersion?: string;
  timestamp?: string; // ISO string for upload/view time
  format: ReportFormat;
};
