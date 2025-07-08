import { SEVERITY_LEVELS, SECURITY_SEVERITY_THRESHOLDS, SEVERITY_COLORS } from '../../constants';
import type { SeverityLevel } from '../../constants';

/**
 * Maps a security severity score (CVSS-style 0-10) to a severity level
 * @param score - The security severity score (0-10)
 * @returns The mapped severity level
 */
export function mapSecuritySeverityScore(score: number): SeverityLevel {
  if (score >= SECURITY_SEVERITY_THRESHOLDS.CRITICAL) return SEVERITY_LEVELS.CRITICAL;
  if (score >= SECURITY_SEVERITY_THRESHOLDS.HIGH) return SEVERITY_LEVELS.HIGH;
  if (score >= SECURITY_SEVERITY_THRESHOLDS.MEDIUM) return SEVERITY_LEVELS.MEDIUM;
  if (score >= SECURITY_SEVERITY_THRESHOLDS.LOW) return SEVERITY_LEVELS.LOW;
  return SEVERITY_LEVELS.INFO;
}

/**
 * Normalizes various severity string formats to our standard severity levels
 * @param severity - The severity string to normalize
 * @returns The normalized severity level
 */
export function normalizeSeverity(severity: string): SeverityLevel {
  const normalized = severity.toLowerCase().trim();

  switch (normalized) {
    case 'critical':
    case 'blocker':
      return SEVERITY_LEVELS.CRITICAL;
    case 'high':
    case 'major':
    case 'error':
      return SEVERITY_LEVELS.HIGH;
    case 'medium':
    case 'moderate':
    case 'warning':
      return SEVERITY_LEVELS.MEDIUM;
    case 'low':
    case 'minor':
      return SEVERITY_LEVELS.LOW;
    case 'info':
    case 'information':
    case 'informational':
    case 'note':
    case 'unknown':
    default:
      return SEVERITY_LEVELS.INFO;
  }
}

/**
 * Gets the display name for a severity level
 * @param severity - The severity level
 * @returns The display name
 */
export function getSeverityDisplayName(severity: SeverityLevel): string {
  const displayNames: Record<SeverityLevel, string> = {
    [SEVERITY_LEVELS.CRITICAL]: 'Critical',
    [SEVERITY_LEVELS.HIGH]: 'High',
    [SEVERITY_LEVELS.MEDIUM]: 'Medium',
    [SEVERITY_LEVELS.LOW]: 'Low',
    [SEVERITY_LEVELS.INFO]: 'Info',
  };

  return displayNames[severity] || 'Unknown';
}

/**
 * Gets the severity colors for UI styling
 * @param severity - The severity level
 * @returns Object containing CSS classes for styling
 */
export function getSeverityColors(severity: SeverityLevel) {
  return SEVERITY_COLORS[severity] || SEVERITY_COLORS.info;
}

/**
 * Sorts severity levels by priority (critical first, info last)
 * @param a - First severity level
 * @param b - Second severity level
 * @returns Sort order (-1, 0, 1)
 */
export function compareSeverity(a: SeverityLevel, b: SeverityLevel): number {
  const severityOrder: Record<SeverityLevel, number> = {
    [SEVERITY_LEVELS.CRITICAL]: 0,
    [SEVERITY_LEVELS.HIGH]: 1,
    [SEVERITY_LEVELS.MEDIUM]: 2,
    [SEVERITY_LEVELS.LOW]: 3,
    [SEVERITY_LEVELS.INFO]: 4,
  };

  return severityOrder[a] - severityOrder[b];
}

/**
 * Gets an icon name suggestion for a severity level
 * @param severity - The severity level
 * @returns Suggested Lucide icon name
 */
export function getSeverityIcon(severity: SeverityLevel): string {
  const iconMap: Record<SeverityLevel, string> = {
    [SEVERITY_LEVELS.CRITICAL]: 'AlertOctagon',
    [SEVERITY_LEVELS.HIGH]: 'AlertTriangle',
    [SEVERITY_LEVELS.MEDIUM]: 'AlertCircle',
    [SEVERITY_LEVELS.LOW]: 'Info',
    [SEVERITY_LEVELS.INFO]: 'InfoIcon',
  };

  return iconMap[severity] || 'InfoIcon';
}

/**
 * Calculates severity distribution percentages
 * @param counts - Object with severity counts
 * @param total - Total number of findings
 * @returns Object with percentage for each severity
 */
export function calculateSeverityPercentages(
  counts: Partial<Record<SeverityLevel, number>>,
  total: number
): Record<SeverityLevel, number> {
  if (total === 0) {
    return {
      [SEVERITY_LEVELS.CRITICAL]: 0,
      [SEVERITY_LEVELS.HIGH]: 0,
      [SEVERITY_LEVELS.MEDIUM]: 0,
      [SEVERITY_LEVELS.LOW]: 0,
      [SEVERITY_LEVELS.INFO]: 0,
    };
  }

  return {
    [SEVERITY_LEVELS.CRITICAL]: Math.round((counts[SEVERITY_LEVELS.CRITICAL] || 0) / total * 100),
    [SEVERITY_LEVELS.HIGH]: Math.round((counts[SEVERITY_LEVELS.HIGH] || 0) / total * 100),
    [SEVERITY_LEVELS.MEDIUM]: Math.round((counts[SEVERITY_LEVELS.MEDIUM] || 0) / total * 100),
    [SEVERITY_LEVELS.LOW]: Math.round((counts[SEVERITY_LEVELS.LOW] || 0) / total * 100),
    [SEVERITY_LEVELS.INFO]: Math.round((counts[SEVERITY_LEVELS.INFO] || 0) / total * 100),
  };
}

/**
 * Filters findings by severity levels
 * @param findings - Array of findings with severity property
 * @param allowedSeverities - Array of severity levels to include
 * @returns Filtered array of findings
 */
export function filterBySeverity<T extends { severity: SeverityLevel }>(
  findings: T[],
  allowedSeverities: SeverityLevel[]
): T[] {
  if (allowedSeverities.length === 0) {
    return findings;
  }

  return findings.filter(finding => allowedSeverities.includes(finding.severity));
}

/**
 * Groups findings by severity level
 * @param findings - Array of findings with severity property
 * @returns Object with findings grouped by severity
 */
export function groupBySeverity<T extends { severity: SeverityLevel }>(
  findings: T[]
): Record<SeverityLevel, T[]> {
  const grouped: Record<string, T[]> = {};

  // Initialize all severity levels with empty arrays
  Object.values(SEVERITY_LEVELS).forEach(level => {
    grouped[level] = [];
  });

  // Group findings
  findings.forEach(finding => {
    if (!grouped[finding.severity]) {
      grouped[finding.severity] = [];
    }
    grouped[finding.severity].push(finding);
  });

  return grouped as Record<SeverityLevel, T[]>;
}
