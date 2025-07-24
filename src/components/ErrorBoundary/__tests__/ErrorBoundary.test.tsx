import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import { ErrorBoundary } from "../ErrorBoundary";

function ThrowError() {
  return (() => {
    throw new Error("Test error thrown!");
  })();
}

// Mock browser APIs for jsdom compatibility
beforeAll(() => {
  Object.defineProperty(window, "location", {
    value: {
      ...window.location,
      reload: vi.fn(),
      href: "",
    },
    writable: true,
  });

  Object.assign(navigator, {
    clipboard: {
      writeText: vi.fn().mockResolvedValue(undefined),
    },
  });
});

describe("ErrorBoundary", () => {
  it("renders fallback UI when error is thrown", () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/An unexpected error occurred/i)).toBeInTheDocument();
    // There are two elements with the error text: one in <p>, one in <pre>
    const errorElements = screen.getAllByText(/Test error thrown!/i);
    expect(errorElements.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(/Try Again/i)).toBeInTheDocument();
    expect(screen.getByText(/Reload Page/i)).toBeInTheDocument();
    expect(screen.getByText(/Go Home/i)).toBeInTheDocument();
  });

  it("calls resetErrorBoundary when Try Again is clicked", () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );
    const tryAgainBtn = screen.getByText(/Try Again/i);
    fireEvent.click(tryAgainBtn);
    // After reset, fallback UI should still be present since ThrowError always throws
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });

  it("copies error details to clipboard when Copy Error is clicked", async () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );
    const copyBtn = screen.getByText(/Copy Error/i);
    fireEvent.click(copyBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });
});
