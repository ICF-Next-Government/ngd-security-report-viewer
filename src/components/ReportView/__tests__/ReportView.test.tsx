import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom";
import { ReportView } from "../ReportView";

const mockSummary = {
  totalFindings: 10,
  criticalCount: 2,
  highCount: 3,
  mediumCount: 1,
  lowCount: 4,
  infoCount: 0,
  filesAffected: 5,
  toolName: "Semgrep",
  toolVersion: "1.0.0",
  format: "semgrep" as const,
  severityCounts: {
    critical: 2,
    high: 3,
    medium: 1,
    low: 4,
    info: 0,
  },
};

const mockResults = [
  {
    id: "1",
    ruleId: "C001",
    ruleName: "Critical Rule",
    message: "Critical issue",
    severity: "critical" as const,
    level: "error",
    file: "src/app.ts",
    startLine: 10,
    endLine: 10,
    startColumn: 2,
    endColumn: 5,
    snippet: "dangerous_code()",
    tags: ["security"],
    format: "semgrep",
    fingerprint: "abc123",
    deduplicationKey: "C001",
    description: "Critical issue description",
    metadata: {},
  },
  {
    id: "2",
    ruleId: "H001",
    ruleName: "High Rule",
    message: "High issue",
    severity: "high" as const,
    level: "warning",
    file: "src/app.ts",
    startLine: 20,
    endLine: 20,
    startColumn: 2,
    endColumn: 5,
    snippet: "risky_code()",
    tags: ["security"],
    format: "semgrep",
    fingerprint: "def456",
    deduplicationKey: "H001",
    description: "High issue description",
    metadata: {},
  },
];

describe("ReportView", () => {
  it("renders the timestamp in the header", () => {
    const timestamp = new Date("2024-06-01T15:30:00");
    render(
      <ReportView
        results={mockResults}
        summary={mockSummary}
        onBack={() => {}}
        uploadTimestamp={timestamp}
      />,
    );
    // Should display formatted timestamp (date and time may be split or formatted differently)
    expect(
      screen.getByText((content) => content.includes("Jun") && content.includes("2024")),
    ).toBeInTheDocument();
    expect(screen.getByText((content) => /\d{2}:\d{2}/.test(content))).toBeInTheDocument();
  });

  it("renders the severity dropdown in the findings filter", () => {
    render(
      <ReportView
        results={mockResults}
        summary={mockSummary}
        onBack={() => {}}
        uploadTimestamp={new Date()}
      />,
    );
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    // Use flexible matcher for display value
    expect(screen.getByDisplayValue(/All Severities/i)).toBeInTheDocument();
    // Use getAllByText for severity options and assert at least one match exists
    ["Critical", "High", "Medium", "Low", "Info"].forEach((severity) => {
      const matches = screen.getAllByText((content) => content.includes(severity));
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  it("renders the findings list and summary", () => {
    render(
      <ReportView
        results={mockResults}
        summary={mockSummary}
        onBack={() => {}}
        uploadTimestamp={new Date()}
      />,
    );
    const reportTitleElements = screen.getAllByText((content) =>
      content.includes("Security Analysis Report"),
    );
    expect(reportTitleElements.length).toBeGreaterThan(0);
    expect(
      screen.getByText((content) => content.includes("Security Findings")),
    ).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes("Critical issue"))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes("High issue"))).toBeInTheDocument();
  });
});
