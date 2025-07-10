/**
 * Centralized styles for HTML generation
 * Extracted from generateHtml.ts for better organization
 */

import { EMBEDDED_INTER_FONTS } from "../../utils/fonts/embeddedFonts";

export const EMBEDDED_FONTS_CSS = `
  /* Embedded Inter fonts for offline usage */
  ${EMBEDDED_INTER_FONTS}

  /* Font family variables */
  :root {
    --font-family-sans: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
    --font-family-mono: ui-monospace, SFMono-Regular, 'SF Mono', Monaco, Menlo, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  }
`;

export const BASE_STYLES = `
  /* Reset and base styles */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    font-family: var(--font-family-sans);
    background: linear-gradient(to bottom right, #0f172a, #1e293b 80%);
    min-height: 100vh;
    color: #e2e8f0;
    line-height: 1.6;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.25;
  }

  p {
    margin-bottom: 1rem;
  }

  pre, code {
    font-family: var(--font-family-mono);
  }
`;

export const SCROLLBAR_STYLES = `
  /* Custom scrollbar styles */
  html, body {
    scrollbar-width: thin;
    scrollbar-color: #334155 #0f172a;
  }

  html::-webkit-scrollbar,
  body::-webkit-scrollbar {
    width: 12px;
    background: #0f172a;
  }

  html::-webkit-scrollbar-thumb,
  body::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #334155 40%, #1e293b);
    border-radius: 8px;
    border: 2px solid #0f172a;
    min-height: 40px;
  }

  html::-webkit-scrollbar-thumb:hover,
  body::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #475569 40%, #334155);
  }

  html::-webkit-scrollbar-corner,
  body::-webkit-scrollbar-corner {
    background: #0f172a;
  }
`;

export const COMPONENT_STYLES = `
  /* View toggle component */
  .view-toggle {
    display: inline-flex;
    background: rgba(51, 65, 85, 0.5);
    border-radius: 0.5rem;
    padding: 0.25rem;
    gap: 0.25rem;
    border: 1px solid #475569;
  }

  .view-toggle button {
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s ease;
    background: transparent;
    color: #94a3b8;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    white-space: nowrap;
  }

  .view-toggle button:hover {
    color: #ffffff;
    background: rgba(71, 85, 105, 0.3);
  }

  .view-toggle button.active {
    background: #3b82f6;
    color: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  .view-toggle button:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  /* Duplicate badge */
  .duplicate-badge {
    display: inline-flex;
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    background: rgba(71, 85, 105, 0.6);
    color: #e2e8f0;
    border-radius: 9999px;
    border: 1px solid #475569;
    margin-left: 0.5rem;
  }

  /* Group locations */
  .group-locations {
    margin-top: 1rem;
    padding: 1rem;
    background: rgba(15, 23, 42, 0.6);
    border-radius: 0.5rem;
    border: 1px solid #334155;
  }

  .location-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0;
    color: #94a3b8;
    font-size: 0.875rem;
    font-family: var(--font-family-mono);
    border-bottom: 1px solid rgba(51, 65, 85, 0.3);
  }

  .location-item:last-child {
    border-bottom: none;
  }

  .location-item svg {
    flex-shrink: 0;
    color: #64748b;
  }

  /* Group toggle */
  .group-toggle {
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .group-toggle:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .group-toggle .chevron {
    transition: transform 0.2s ease;
  }

  .group-toggle[aria-expanded="true"] .chevron {
    transform: rotate(180deg);
  }
`;

export const SEARCH_STYLES = `
  /* Search and filter styles */
  .search-container {
    position: relative;
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }

  .search-input-wrapper {
    position: relative;
    flex: 1;
    min-width: 250px;
  }

  .search-input {
    width: 100%;
    padding: 0.75rem 2.5rem 0.75rem 1rem;
    background: rgba(30, 41, 59, 0.6);
    border: 1px solid #475569;
    border-radius: 0.5rem;
    color: #e2e8f0;
    font-size: 0.875rem;
    transition: all 0.2s ease;
  }

  .search-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .search-input::placeholder {
    color: #64748b;
  }

  .search-clear {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #64748b;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 0.25rem;
    transition: color 0.2s ease;
  }

  .search-clear:hover {
    color: #94a3b8;
  }

  .severity-filter {
    padding: 0.75rem 1rem;
    background: rgba(30, 41, 59, 0.6);
    border: 1px solid #475569;
    border-radius: 0.5rem;
    color: #e2e8f0;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .severity-filter:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  /* Highlight styles */
  .inline-highlight {
    background: #fbbf24;
    color: #1f2937;
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-weight: 600;
  }

  /* No results message */
  .inline-no-results {
    display: none;
    text-align: center;
    padding: 3rem;
    background: rgba(30, 41, 59, 0.3);
    border: 1px solid #475569;
    border-radius: 0.75rem;
    color: #94a3b8;
  }

  .inline-no-results svg {
    opacity: 0.6;
  }
`;

export const UTILITY_STYLES = `
  /* Utility classes */
  .container {
    max-width: 80rem;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .card {
    background: rgba(30, 41, 59, 0.5);
    backdrop-filter: blur(12px);
    border: 1px solid #475569;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
    cursor: pointer;
    border: none;
    text-decoration: none;
  }

  .btn-primary {
    background: #3b82f6;
    color: #ffffff;
  }

  .btn-primary:hover {
    background: #2563eb;
  }

  .btn-secondary {
    background: rgba(71, 85, 105, 0.5);
    color: #e2e8f0;
    border: 1px solid #475569;
  }

  .btn-secondary:hover {
    background: rgba(71, 85, 105, 0.8);
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .container {
      padding: 0 0.75rem;
    }

    .search-container {
      flex-direction: column;
      align-items: stretch;
    }

    .search-input-wrapper {
      min-width: auto;
    }

    .view-toggle {
      width: 100%;
      justify-content: center;
    }

    .view-toggle button {
      flex: 1;
      justify-content: center;
    }
  }

  @media (max-width: 640px) {
    .card {
      padding: 1rem;
    }

    .search-input {
      font-size: 1rem; /* Prevents zoom on iOS */
    }
  }
`;

export const ANIMATION_STYLES = `
  /* Animation and transition styles */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(1rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      max-height: 0;
      padding-top: 0;
      padding-bottom: 0;
    }
    to {
      opacity: 1;
      max-height: 1000px;
      padding-top: 1rem;
      padding-bottom: 1rem;
    }
  }

  .animate-fade-in {
    animation: fadeIn 0.6s ease-out;
  }

  .animate-slide-down {
    animation: slideDown 0.3s ease-out;
  }

  .transition-all {
    transition: all 0.2s ease;
  }

  .transition-colors {
    transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
  }

  .transition-transform {
    transition: transform 0.2s ease;
  }
`;

/**
 * Combines all styles into a single CSS string for HTML generation
 */
export function getAllStyles(offlineMode: boolean = true): string {
  const styles = [
    BASE_STYLES,
    SCROLLBAR_STYLES,
    COMPONENT_STYLES,
    SEARCH_STYLES,
    UTILITY_STYLES,
    ANIMATION_STYLES,
  ];

  if (offlineMode) {
    styles.unshift(EMBEDDED_FONTS_CSS);
  }

  return styles.join('\n\n');
}

/**
 * Severity color mappings used throughout the application
 */
export const SEVERITY_COLORS = {
  critical: {
    bg: "rgba(127, 29, 29, 0.2)", // bg-red-900/20
    text: "#fca5a5", // text-red-300
    border: "#b91c1c", // border-red-700
    icon: "#f87171", // text-red-400
    badge: "rgba(127, 29, 29, 0.4)", // bg-red-900/40
  },
  high: {
    bg: "rgba(124, 45, 18, 0.2)", // bg-orange-900/20
    text: "#fdba74", // text-orange-300
    border: "#c2410c", // border-orange-700
    icon: "#fb923c", // text-orange-400
    badge: "rgba(124, 45, 18, 0.4)", // bg-orange-900/40
  },
  medium: {
    bg: "rgba(120, 53, 15, 0.2)", // bg-amber-900/20
    text: "#fcd34d", // text-amber-300
    border: "#a16207", // border-amber-700
    icon: "#fbbf24", // text-amber-400
    badge: "rgba(120, 53, 15, 0.4)", // bg-amber-900/40
  },
  low: {
    bg: "rgba(30, 58, 138, 0.2)", // bg-blue-900/20
    text: "#93c5fd", // text-blue-300
    border: "#1d4ed8", // border-blue-700
    icon: "#60a5fa", // text-blue-400
    badge: "rgba(30, 58, 138, 0.4)", // bg-blue-900/40
  },
  info: {
    bg: "rgba(30, 41, 59, 0.5)", // bg-slate-800/50
    text: "#cbd5e1", // text-slate-300
    border: "#475569", // border-slate-600
    icon: "#94a3b8", // text-slate-400
    badge: "rgba(51, 65, 85, 0.5)", // bg-slate-700/50
  },
} as const;

export type SeverityLevel = keyof typeof SEVERITY_COLORS;
