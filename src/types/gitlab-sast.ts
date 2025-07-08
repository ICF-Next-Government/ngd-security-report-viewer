// GitLab SAST JSON output TypeScript definitions
export type GitLabSastReport = {
  version: string;
  vulnerabilities: GitLabSastVulnerability[];
  scan?: GitLabSastScan;
  remediations?: GitLabSastRemediation[];
};

export type GitLabSastVulnerability = {
  id: string;
  category: string;
  name: string;
  message?: string;
  description: string;
  cve?: string;
  severity: "Critical" | "High" | "Medium" | "Low" | "Info" | "Unknown";
  confidence?: "High" | "Medium" | "Low" | "Unknown";
  scanner: GitLabSastScanner;
  location: GitLabSastLocation;
  identifiers: GitLabSastIdentifier[];
  links?: GitLabSastLink[];
  evidence?: GitLabSastEvidence;
  solution?: string;
  flags?: GitLabSastFlag[];
  raw_source_code_extract?: string;
};

export type GitLabSastScanner = {
  id: string;
  name: string;
};

export type GitLabSastLocation = {
  file: string;
  start_line?: number;
  end_line?: number;
  start_column?: number;
  end_column?: number;
  class?: string;
  method?: string;
  dependency?: {
    package?: {
      name?: string;
    };
    version?: string;
  };
};

export type GitLabSastIdentifier = {
  type: string;
  name: string;
  value: string;
  url?: string;
};

export type GitLabSastLink = {
  name?: string;
  url: string;
};

export type GitLabSastEvidence = {
  source?: GitLabSastEvidenceSource;
  summary?: string;
  request?: GitLabSastEvidenceRequest;
  response?: GitLabSastEvidenceResponse;
  supporting_messages?: GitLabSastSupportingMessage[];
};

export type GitLabSastEvidenceSource = {
  id: string;
  name: string;
  url?: string;
};

export type GitLabSastEvidenceRequest = {
  headers?: GitLabSastHeader[];
  method?: string;
  url?: string;
  body?: string;
};

export type GitLabSastEvidenceResponse = {
  headers?: GitLabSastHeader[];
  reason_phrase?: string;
  status_code?: number;
  body?: string;
};

export type GitLabSastHeader = {
  name: string;
  value: string;
};

export type GitLabSastSupportingMessage = {
  name: string;
  request?: GitLabSastEvidenceRequest;
  response?: GitLabSastEvidenceResponse;
};

export type GitLabSastFlag = {
  type: string;
  origin?: string;
  description: string;
};

export type GitLabSastRemediation = {
  fixes: GitLabSastFix[];
  summary?: string;
};

export type GitLabSastFix = {
  id?: string;
  cve?: string;
};

export type GitLabSastScan = {
  scanner: GitLabSastScannerInfo;
  analyzer?: GitLabSastAnalyzer;
  status: "success" | "failure";
  type: string;
  start_time?: string;
  end_time?: string;
  messages?: GitLabSastMessage[];
  observability?: GitLabSastObservability;
};

export type GitLabSastScannerInfo = {
  id: string;
  name: string;
  url?: string;
  vendor?: {
    name: string;
  };
  version: string;
};

export type GitLabSastAnalyzer = {
  id: string;
  name: string;
  url?: string;
  vendor?: {
    name: string;
  };
  version: string;
};

export type GitLabSastMessage = {
  level: "error" | "warning" | "info";
  value: string;
};

export type GitLabSastObservability = {
  events?: GitLabSastEvent[];
};

export type GitLabSastEvent = {
  event: string;
  property?: string;
  label?: string;
  value?: number;
  version?: string;
  exit_code?: number;
  override_count?: number;
  passthrough_count?: number;
  custom_exclude_path_count?: number;
  time_s?: number;
  file_count?: number;
};
