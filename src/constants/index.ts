// Application constants for better maintainability

// File upload limits
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const VALID_FILE_EXTENSIONS = ['.json', '.sarif'] as const;

// Severity levels
export const SEVERITY_LEVELS = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  INFO: 'info',
} as const;

export type SeverityLevel = typeof SEVERITY_LEVELS[keyof typeof SEVERITY_LEVELS];

// Security severity score thresholds (CVSS-style)
export const SECURITY_SEVERITY_THRESHOLDS = {
  CRITICAL: 9.0,
  HIGH: 7.0,
  MEDIUM: 4.0,
  LOW: 1.0,
} as const;

// Report formats
export const REPORT_FORMATS = {
  SARIF: 'sarif',
  SEMGREP: 'semgrep',
  GITLAB_SAST: 'gitlab-sast',
} as const;

export type ReportFormat = typeof REPORT_FORMATS[keyof typeof REPORT_FORMATS];

// UI Animation durations (in ms)
export const ANIMATION_DURATIONS = {
  FADE_TRANSITION: 350,
  PANEL_TRANSITION: 500,
  FOCUS_DELAY: 100,
} as const;

// Pagination
export const ITEMS_PER_PAGE = 50;

// Export filename patterns
export const EXPORT_FILENAME_PATTERN = 'security-report-{timestamp}.html';

// Error messages
export const ERROR_MESSAGES = {
  INVALID_FILE_TYPE: 'Please upload a JSON or SARIF file',
  FILE_TOO_LARGE: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`,
  PARSE_ERROR: 'Failed to parse file. Please ensure it\'s a valid SARIF, Semgrep, or GitLab SAST JSON file.',
  UNSUPPORTED_FORMAT: 'Unsupported format. Please provide a valid SARIF, Semgrep, or GitLab SAST JSON file.',
} as const;

// Tool names
export const TOOL_NAMES = {
  GITLAB_SAST: 'GitLab SAST',
  SEMGREP: 'Semgrep',
  UNKNOWN: 'Unknown Tool',
} as const;

// Severity colors for UI consistency
export const SEVERITY_COLORS = {
  critical: {
    bg: 'bg-red-900/50',
    border: 'border-red-700',
    text: 'text-red-300',
    icon: 'text-red-400',
  },
  high: {
    bg: 'bg-orange-900/50',
    border: 'border-orange-700',
    text: 'text-orange-300',
    icon: 'text-orange-400',
  },
  medium: {
    bg: 'bg-yellow-900/50',
    border: 'border-yellow-700',
    text: 'text-yellow-300',
    icon: 'text-yellow-400',
  },
  low: {
    bg: 'bg-blue-900/50',
    border: 'border-blue-700',
    text: 'text-blue-300',
    icon: 'text-blue-400',
  },
  info: {
    bg: 'bg-slate-800/50',
    border: 'border-slate-600',
    text: 'text-slate-300',
    icon: 'text-slate-400',
  },
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'sarif-viewer-theme',
  LAST_REPORT_FORMAT: 'sarif-viewer-last-format',
} as const;
