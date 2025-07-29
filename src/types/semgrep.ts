// Semgrep JSON output TypeScript definitions
export type SemgrepOutput = {
  errors: SemgrepError[];
  paths: SemgrepPath;
  results: SemgrepResult[];
  version: string;
  skipped_rules?: string[];
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

// Position format used in newer Semgrep versions
export type SemgrepPosition = {
  line: number;
  col: number;
  offset: number;
};

// Support both old and new Semgrep result formats
export type SemgrepResult = {
  check_id: string;
  path: string;
  // Old format (deprecated but still supported)
  line?: number;
  column?: number;
  end_line?: number;
  end_column?: number;
  // New format with start/end objects
  start?: SemgrepPosition;
  end?: SemgrepPosition;
  // Common fields
  message?: string;
  severity?: "ERROR" | "WARNING" | "INFO";
  metadata?: SemgrepMetadata;
  extra: SemgrepExtra;
};

export type SemgrepMetadata = {
  category?: string;
  technology?: string[];
  confidence?: string;
  likelihood?: string;
  impact?: string;
  subcategory?: string[];
  cwe?: string[] | string;
  owasp?: string[] | string;
  references?: string[];
  source?: string;
  source_rule_url?: string;
  vulnerability_class?: string[];
  license?: string;
  "security-severity"?: string;
  description?: string;
  shortlink?: string;
  "semgrep.dev"?: {
    rule?: {
      origin?: string;
      r_id?: string | number;
      rule_id?: string;
      rv_id?: string | number;
      url?: string;
      version_id?: string;
    };
  };
  // OWASP specific fields
  asvs?: {
    control_id?: string;
    control_url?: string;
    section?: string;
    version?: string;
  };
  "bandit-code"?: string;
  "source-rule-url"?: string;
  cwe2021_top25?: boolean;
  "cwe2021-top25"?: boolean;
  cwe2022_top25?: boolean;
  "cwe2022-top25"?: boolean;
  [key: string]: any;
};

export type SemgrepExtra = {
  metavars?: Record<string, SemgrepMetavar>;
  metadata?: SemgrepMetadata;
  severity?: string;
  lines?: string;
  message?: string;
  fingerprint?: string;
  is_ignored?: boolean;
  engine_kind?: string;
  validation_state?: string;
  fix?: string;
};

export type SemgrepMetavar = {
  start: SemgrepPosition;
  end: SemgrepPosition;
  abstract_content: string;
  propagated_value?: any;
};
