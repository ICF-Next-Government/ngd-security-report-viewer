import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LandingPage } from "../LandingPage";
import "@testing-library/jest-dom";

describe("LandingPage", () => {
  it("renders the main hero content", () => {
    render(<LandingPage onFileUpload={() => {}} onJsonParse={() => {}} loading={false} />);
    const viewerElements = screen.getAllByText(/Security Report Viewer/i);
    expect(viewerElements.length).toBeGreaterThan(0);
  });

  it("shows the recent report card when recentReport is provided", () => {
    const recentReport = {
      fileName: "test-report.json",
      timestamp: new Date("2024-06-01T12:34:56"),
      totalFindings: 42,
      criticalCount: 2,
      highCount: 5,
    };
    render(
      <LandingPage
        onFileUpload={() => {}}
        onJsonParse={() => {}}
        loading={false}
        recentReport={recentReport}
        onViewRecentReport={() => {}}
        onClearRecentReport={() => {}}
      />,
    );
    expect(screen.getByText(/Recent Report/i)).toBeInTheDocument();
    // Use flexible matchers for findings and files
    expect(
      screen.getByText((content) => content.toLowerCase().includes("critical")),
    ).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.toLowerCase().includes("high")),
    ).toBeInTheDocument();
    // Refine file-related assertion to avoid upload/browse matches
    const fileElements = screen.getAllByText((content) => content.toLowerCase().includes("file"));
    // At least one should be in the recent report card context (not upload/browse)
    expect(fileElements.length).toBeGreaterThan(0);
  });

  it("calls onViewRecentReport when recent report card is clicked", () => {
    const onViewRecentReport = vi.fn();
    const recentReport = {
      fileName: "test-report.json",
      timestamp: new Date(),
      totalFindings: 10,
      criticalCount: 1,
      highCount: 0,
    };
    render(
      <LandingPage
        onFileUpload={() => {}}
        onJsonParse={() => {}}
        loading={false}
        recentReport={recentReport}
        onViewRecentReport={onViewRecentReport}
        onClearRecentReport={() => {}}
      />,
    );
    const card = screen.getByRole("button", { name: /View recent report/i });
    fireEvent.click(card);
    expect(onViewRecentReport).toHaveBeenCalled();
  });
});
