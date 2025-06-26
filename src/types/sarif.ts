// SARIF v2.1.0 TypeScript definitions
export type SarifLog = {
  version: string;
  $schema?: string;
  runs: SarifRun[];
};

export type SarifRun = {
  tool: SarifTool;
  results: SarifResult[];
  rules?: SarifRule[];
};

export type SarifTool = {
  driver: SarifToolComponent;
};

export type SarifToolComponent = {
  name: string;
  version?: string;
  informationUri?: string;
  rules?: SarifRule[];
};

export type SarifRule = {
  id: string;
  name?: string;
  shortDescription?: SarifMessage;
  fullDescription?: SarifMessage;
  help?: SarifMessage;
  properties?: {
    tags?: string[];
    precision?: string;
    "security-severity"?: string;
  };
};

export type SarifResult = {
  ruleId?: string;
  ruleIndex?: number;
  rule?: SarifRule;
  message: SarifMessage;
  level?: "note" | "info" | "warning" | "error";
  locations?: SarifLocation[];
  fingerprints?: { [key: string]: string };
  properties?: {
    "security-severity"?: string;
  };
};

export type SarifMessage = {
  text: string;
  markdown?: string;
};

export type SarifLocation = {
  physicalLocation?: SarifPhysicalLocation;
};

export type SarifPhysicalLocation = {
  artifactLocation: SarifArtifactLocation;
  region?: SarifRegion;
  contextRegion?: SarifRegion;
};

export type SarifArtifactLocation = {
  uri: string;
  uriBaseId?: string;
};

export type SarifRegion = {
  startLine?: number;
  startColumn?: number;
  endLine?: number;
  endColumn?: number;
  snippet?: {
    text: string;
  };
};

// Processed types for our application
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
  snippet?: string;
  description?: string;
  tags: string[];
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
};
