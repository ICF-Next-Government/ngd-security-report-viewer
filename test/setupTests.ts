/**
 * Global test setup for Bun/Vitest/Testing Library.
 * - Mocks browser APIs (window, document, navigator.clipboard, etc.)
 * - Loads jest-dom matchers for extended assertions.
 * - Ensures React is in scope for all tests (for JSX/FC usage).
 */

import "@testing-library/jest-dom";

// Mock window.location.reload and window.location.href
if (typeof window !== "undefined") {
  Object.defineProperty(window, "location", {
    value: {
      ...window.location,
      reload: () => {},
      href: "",
    },
    writable: true,
  });
}

// Mock navigator.clipboard.writeText
if (typeof navigator !== "undefined") {
  if (!navigator.clipboard) {
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: async () => Promise.resolve(),
      },
      writable: true,
    });
  } else {
    navigator.clipboard.writeText = async () => Promise.resolve();
  }
}

// Suppress jsdom "uncaught error" logs during tests
if (typeof window !== "undefined") {
  const originalConsoleError = console.error;
  // Only suppress jsdom errors, not all errors
  // @ts-ignore
  console.error = (...args: any[]) => {
    if (typeof args[0] === "string" && args[0].includes("Error: Uncaught [Error:")) {
      return;
    }
    originalConsoleError(...args);
  };
}
