// Semgrep JSON output TypeScript definitions
export type SemgrepOutput = {
  errors: SemgrepError[];
  paths: SemgrepPath;
  results: SemgrepResult[];
  version: string;
};

export type SemgrepError = {
  code: number;
  level: string;
  message: string;
  type: string;
};

export type SemgrepPath = {
  scanned: string[];
};

export type SemgrepResult = {
  check_id: string;
  path: string;
  line: number;
  column: number;
  end_line: number;
  end_column: number;
  message: string;
  severity: "ERROR" | "WARNING" | "INFO";
  metadata: SemgrepMetadata;
  extra: SemgrepExtra;
};

export type SemgrepMetadata = {
  category?: string;
  technology?: string[];
  confidence?: string;
  likelihood?: string;
  impact?: string;
  subcategory?: string[];
  cwe?: string[];
  owasp?: string[];
  references?: string[];
  source?: string;
  source_rule_url?: string;
  vulnerability_class?: string[];
  license?: string;
  "security-severity"?: string;
  [key: string]: any;
};

export type SemgrepExtra = {
  metavars?: Record<string, SemgrepMetavar>;
  metadata?: Record<string, any>;
  severity?: string;
  lines?: string;
  message?: string;
  fingerprint?: string;
  is_ignored?: boolean;
  engine_kind?: string;
};

export type SemgrepMetavar = {
  start: SemgrepPosition;
  end: SemgrepPosition;
  abstract_content: string;
  propagated_value?: any;
};

export type SemgrepPosition = {
  line: number;
  col: number;
  offset: number;
};
