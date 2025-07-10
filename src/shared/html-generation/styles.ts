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

  /* Enhanced finding and group styles */
  .finding-result {
    margin-bottom: 1.5rem;
    border-radius: 0.75rem;
    overflow: hidden;
    position: relative;
  }

  .finding-result:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
  }

  .finding-title {
    font-size: 1.25rem;
    line-height: 1.75rem;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 0.5rem;
  }

  .finding-message {
    color: #cbd5e1;
    margin-bottom: 1rem;
    line-height: 1.625;
  }

  .finding-details {
    font-size: 0.875rem;
    color: #94a3b8;
  }

  .finding-description {
    margin-top: 1rem;
    padding: 1rem;
    background: rgba(15, 23, 42, 0.4);
    border-radius: 0.5rem;
    border: 1px solid rgba(51, 65, 85, 0.3);
  }

  .finding-tags {
    margin-top: 1rem;
  }

  .finding-tag {
    background: rgba(51, 65, 85, 0.6);
    color: #e2e8f0;
    border: 1px solid #475569;
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-weight: 500;
  }

  .severity-badge {
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .severity-icon svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  .rule-id {
    font-family: var(--font-family-mono);
    background: rgba(51, 65, 85, 0.3);
    padding: 0.125rem 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid rgba(71, 85, 105, 0.3);
  }

  .file-location {
    margin-top: 0.5rem;
    padding: 0.5rem;
    background: rgba(30, 41, 59, 0.3);
    border-radius: 0.375rem;
    border: 1px solid rgba(51, 65, 85, 0.3);
  }

  .file-location svg {
    color: #64748b;
    flex-shrink: 0;
  }

  .code-snippet-container {
    margin-top: 1rem;
  }

  .snippet-title {
    font-weight: 500;
    color: #ffffff;
    margin-bottom: 0.75rem;
    font-size: 0.875rem;
  }

  .code-snippet {
    background: rgba(15, 23, 42, 0.8);
    color: #f1f5f9;
    padding: 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    overflow-x: auto;
    border: 1px solid #334155;
    font-family: var(--font-family-mono);
    line-height: 1.5;
  }

  .snippet-code {
    white-space: pre;
    display: block;
  }

  .locations-list {
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid rgba(51, 65, 85, 0.3);
    border-radius: 0.375rem;
    background: rgba(15, 23, 42, 0.4);
  }

  .location-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    color: #94a3b8;
    font-size: 0.875rem;
    border-bottom: 1px solid rgba(51, 65, 85, 0.2);
    transition: background-color 0.2s ease;
  }

  .location-item:last-child {
    border-bottom: none;
  }

  .location-item:hover {
    background: rgba(30, 41, 59, 0.4);
  }

  .location-icon svg {
    flex-shrink: 0;
    color: #64748b;
    width: 1rem;
    height: 1rem;
  }

  .location-path {
    font-family: var(--font-family-mono);
    word-break: break-all;
  }

  .locations-title {
    font-weight: 500;
    color: #ffffff;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .group-finding {
    cursor: pointer;
    user-select: none;
  }

  .group-finding:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  .severity-card {
    position: relative;
    overflow: hidden;
  }

  .severity-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: currentColor;
    opacity: 0.6;
  }

  .severity-critical::before { background: #ef4444; }
  .severity-high::before { background: #f97316; }
  .severity-medium::before { background: #eab308; }
  .severity-low::before { background: #3b82f6; }
  .severity-info::before { background: #6b7280; }

  .severity-bar {
    transition: all 0.3s ease;
    position: relative;
  }

  .severity-bar:hover {
    opacity: 0.8;
    transform: scaleY(1.1);
  }

  .severity-legend-dot {
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }

  .severity-legend-dot:hover {
    transform: scale(1.2);
  }

  /* File upload component */
  .file-upload-area {
    position: relative;
    border: 2px dashed #475569;
    border-radius: 0.75rem;
    padding: 1.5rem;
    text-align: center;
    transition: all 0.2s ease;
    background: rgba(30, 41, 59, 0.5);
    backdrop-filter: blur(4px);
  }

  .file-upload-area:hover {
    border-color: #64748b;
  }

  .file-upload-area.drag-active {
    border-color: #60a5fa;
    background: rgba(59, 130, 246, 0.1);
    backdrop-filter: blur(4px);
  }

  /* Input and textarea styles */
  input[type="text"],
  input[type="search"],
  input[type="file"],
  textarea {
    width: 100%;
    padding: 0.5rem;
    background: rgba(15, 23, 42, 0.8);
    border: 1px solid #334155;
    border-radius: 0.5rem;
    color: #e2e8f0;
    font-size: 0.875rem;
    transition: all 0.15s ease;
  }

  input[type="text"]:focus,
  input[type="search"]:focus,
  textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }

  input[type="file"] {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  textarea {
    min-height: 120px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    resize: vertical;
  }

  /* Button styles */
  button {
    cursor: pointer;
    transition: all 0.15s ease;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Copy button */
  .copy-button {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    padding: 0.5rem 0.25rem;
    border-radius: 0.25rem;
    background: #334155;
    color: #e2e8f0;
    font-size: 0.75rem;
    transition: all 0.15s ease;
  }

  .copy-button:hover {
    background: #2563eb;
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

  /* Additional search result styles */
  .search-no-results {
    text-align: center;
    padding: 3rem;
    color: #94a3b8;
  }

  /* Code block styles */
  pre {
    background: rgba(15, 23, 42, 0.8);
    border: 1px solid #334155;
    border-radius: 0.5rem;
    padding: 1rem;
    overflow-x: auto;
    font-size: 0.875rem;
    line-height: 1.5;
  }

  code {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    font-size: 0.875em;
    color: #e2e8f0;
  }

  /* Details/Summary styles */
  details {
    margin-top: 1rem;
  }

  summary {
    cursor: pointer;
    color: #94a3b8;
    font-size: 0.875rem;
    transition: color 0.15s ease;
  }

  summary:hover {
    color: #cbd5e1;
  }

  /* Link styles */
  a {
    color: #60a5fa;
    text-decoration: none;
    transition: color 0.15s ease;
  }

  a:hover {
    color: #93c5fd;
    text-decoration: underline;
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

export const TAILWIND_UTILITIES = `
  /* Tailwind-equivalent utility classes for HTML export */

  /* Flexbox utilities */
  .flex { display: flex; }
  .inline-flex { display: inline-flex; }
  .flex-col { flex-direction: column; }
  .flex-row { flex-direction: row; }
  .flex-wrap { flex-wrap: wrap; }
  .items-start { align-items: flex-start; }
  .items-center { align-items: center; }
  .items-end { align-items: flex-end; }
  .items-stretch { align-items: stretch; }
  .justify-start { justify-content: flex-start; }
  .justify-center { justify-content: center; }
  .justify-between { justify-content: space-between; }
  .justify-end { justify-content: flex-end; }
  .flex-1 { flex: 1 1 0%; }
  .flex-shrink-0 { flex-shrink: 0; }
  .flex-grow { flex-grow: 1; }

  /* Grid utilities */
  .grid { display: grid; }
  .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
  .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .grid-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }

  /* Spacing utilities */
  .space-x-1 > * + * { margin-left: 0.25rem; }
  .space-x-2 > * + * { margin-left: 0.5rem; }
  .space-x-3 > * + * { margin-left: 0.75rem; }
  .space-x-4 > * + * { margin-left: 1rem; }
  .space-x-6 > * + * { margin-left: 1.5rem; }
  .space-y-1 > * + * { margin-top: 0.25rem; }
  .space-y-2 > * + * { margin-top: 0.5rem; }
  .space-y-3 > * + * { margin-top: 0.75rem; }
  .space-y-4 > * + * { margin-top: 1rem; }
  .space-y-6 > * + * { margin-top: 1.5rem; }
  .space-y-8 > * + * { margin-top: 2rem; }
  .gap-2 { gap: 0.5rem; }
  .gap-3 { gap: 0.75rem; }
  .gap-4 { gap: 1rem; }
  .gap-6 { gap: 1.5rem; }

  /* Sizing utilities */
  .h-3 { height: 0.75rem; }
  .h-4 { height: 1rem; }
  .h-5 { height: 1.25rem; }
  .h-6 { height: 1.5rem; }
  .h-7 { height: 1.75rem; }
  .h-8 { height: 2rem; }
  .h-12 { height: 3rem; }
  .h-[440px] { height: 440px; }
  .w-3 { width: 0.75rem; }
  .w-4 { width: 1rem; }
  .w-5 { width: 1.25rem; }
  .w-6 { width: 1.5rem; }
  .w-7 { width: 1.75rem; }
  .w-8 { width: 2rem; }
  .w-12 { width: 3rem; }
  .w-full { width: 100%; }
  .w-fit { width: fit-content; }
  .w-auto { width: auto; }
  .min-w-0 { min-width: 0px; }
  .min-h-[120px] { min-height: 120px; }
  .min-h-screen { min-height: 100vh; }
  .max-w-xs { max-width: 20rem; }
  .max-w-sm { max-width: 24rem; }
  .max-w-md { max-width: 28rem; }
  .max-w-lg { max-width: 32rem; }
  .max-w-xl { max-width: 36rem; }
  .max-w-2xl { max-width: 42rem; }
  .max-w-4xl { max-width: 56rem; }
  .max-w-6xl { max-width: 72rem; }
  .max-w-7xl { max-width: 80rem; }
  .max-w-[60vw] { max-width: 60vw; }
  .max-h-64 { max-height: 16rem; }

  /* Text utilities */
  .text-xs { font-size: 0.75rem; line-height: 1rem; }
  .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
  .text-base { font-size: 1rem; line-height: 1.5rem; }
  .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
  .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
  .text-2xl { font-size: 1.5rem; line-height: 2rem; }
  .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
  .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
  .font-medium { font-weight: 500; }
  .font-semibold { font-weight: 600; }
  .font-bold { font-weight: 700; }
  .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
  .leading-relaxed { line-height: 1.625; }
  .text-center { text-align: center; }
  .text-left { text-align: left; }
  .text-right { text-align: right; }
  .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .underline { text-decoration: underline; }
  .whitespace-nowrap { white-space: nowrap; }

  /* Color utilities */
  .text-white { color: #ffffff; }
  .text-slate-100 { color: #f1f5f9; }
  .text-slate-200 { color: #e2e8f0; }
  .text-slate-300 { color: #cbd5e1; }
  .text-slate-400 { color: #94a3b8; }
  .text-slate-500 { color: #64748b; }
  .text-blue-300 { color: #93c5fd; }
  .text-blue-400 { color: #60a5fa; }
  .text-red-200 { color: #fecaca; }
  .text-red-300 { color: #fca5a5; }
  .text-red-400 { color: #f87171; }
  .text-orange-300 { color: #fdba74; }
  .text-orange-400 { color: #fb923c; }
  .text-amber-300 { color: #fcd34d; }
  .text-amber-400 { color: #fbbf24; }
  .text-purple-400 { color: #c084fc; }
  .text-green-300 { color: #86efac; }
  .text-green-400 { color: #4ade80; }
  .text-yellow-300 { color: #fde047; }
  .text-yellow-400 { color: #facc15; }

  /* Icon size utilities */
  .icon-xs { width: 0.75rem; height: 0.75rem; }
  .icon-sm { width: 1rem; height: 1rem; }
  .icon-md { width: 1.25rem; height: 1.25rem; }
  .icon-lg { width: 1.5rem; height: 1.5rem; }
  .icon-xl { width: 2rem; height: 2rem; }

  /* Background utilities */
  .bg-black\/60 { background-color: rgba(0, 0, 0, 0.6); }
  .bg-slate-600 { background-color: #475569; }
  .bg-slate-700 { background-color: #334155; }
  .bg-slate-700\/50 { background-color: rgba(51, 65, 85, 0.5); }
  .bg-slate-700\/90 { background-color: rgba(51, 65, 85, 0.9); }
  .bg-slate-800\/50 { background-color: rgba(30, 41, 59, 0.5); }
  .bg-slate-800\/70 { background-color: rgba(30, 41, 59, 0.7); }
  .bg-slate-800\/90 { background-color: rgba(30, 41, 59, 0.9); }
  .bg-slate-900 { background-color: #0f172a; }
  .bg-slate-900\/50 { background-color: rgba(15, 23, 42, 0.5); }
  .bg-slate-900\/80 { background-color: rgba(15, 23, 42, 0.8); }
  .bg-red-700\/50 { background-color: rgba(185, 28, 28, 0.5); }
  .bg-red-900\/20 { background-color: rgba(127, 29, 29, 0.2); }
  .bg-red-900\/40 { background-color: rgba(127, 29, 29, 0.4); }
  .bg-red-900\/50 { background-color: rgba(127, 29, 29, 0.5); }
  .bg-red-900\/90 { background-color: rgba(127, 29, 29, 0.9); }
  .bg-orange-900\/20 { background-color: rgba(124, 45, 18, 0.2); }
  .bg-orange-900\/40 { background-color: rgba(124, 45, 18, 0.4); }
  .bg-amber-900\/20 { background-color: rgba(120, 53, 15, 0.2); }
  .bg-amber-900\/40 { background-color: rgba(120, 53, 15, 0.4); }
  .bg-blue-500\/10 { background-color: rgba(59, 130, 246, 0.1); }
  .bg-blue-500\/20 { background-color: rgba(59, 130, 246, 0.2); }
  .bg-blue-600 { background-color: #2563eb; }
  .bg-blue-700 { background-color: #1d4ed8; }
  .bg-blue-900\/20 { background-color: rgba(30, 58, 138, 0.2); }
  .bg-blue-900\/40 { background-color: rgba(30, 58, 138, 0.4); }
  .bg-green-500\/20 { background-color: rgba(34, 197, 94, 0.2); }
  .bg-green-700\/50 { background-color: rgba(21, 128, 61, 0.5); }
  .bg-purple-500\/20 { background-color: rgba(168, 85, 247, 0.2); }
  .bg-transparent { background-color: transparent; }
  .bg-yellow-900\/50 { background-color: rgba(113, 63, 18, 0.5); }

  /* Additional severity-specific backgrounds */
  .bg-red-500 { background-color: #ef4444; }
  .bg-orange-500 { background-color: #f97316; }
  .bg-amber-500 { background-color: #f59e0b; }
  .bg-blue-500 { background-color: #3b82f6; }
  .bg-red-900 { background-color: #7f1d1d; }
  .bg-orange-900 { background-color: #7c2d12; }
  .bg-amber-900 { background-color: #78350f; }
  .bg-blue-900 { background-color: #1e3a8a; }
  .bg-slate-500 { background-color: #64748b; }
  .bg-slate-800 { background-color: #1e293b; }

  /* Border utilities */
  .border { border-width: 1px; }
  .border-2 { border-width: 2px; }
  .border-4 { border-width: 4px; }
  .border-t { border-top-width: 1px; }
  .border-b { border-bottom-width: 1px; }
  .border-l { border-left-width: 1px; }
  .border-dashed { border-style: dashed; }
  .border-slate-600 { border-color: #475569; }
  .border-slate-700 { border-color: #334155; }
  .border-red-600 { border-color: #dc2626; }
  .border-red-700 { border-color: #b91c1c; }
  .border-red-700\/50 { border-color: rgba(185, 28, 28, 0.5); }
  .border-orange-700 { border-color: #c2410c; }
  .border-amber-700 { border-color: #a16207; }
  .border-blue-400 { border-color: #60a5fa; }
  .border-blue-500 { border-color: #3b82f6; }
  .border-blue-600 { border-color: #2563eb; }
  .border-blue-700 { border-color: #1d4ed8; }
  .border-blue-700\/50 { border-color: rgba(29, 78, 216, 0.5); }
  .border-green-600 { border-color: #16a34a; }
  .border-transparent { border-color: transparent; }
  .border-t-transparent { border-top-color: transparent; }
  .border-b-red-700 { border-bottom-color: #b91c1c; }
  .border-yellow-700 { border-color: #a16207; }
  .rounded { border-radius: 0.25rem; }
  .rounded-md { border-radius: 0.375rem; }
  .rounded-lg { border-radius: 0.5rem; }
  .rounded-xl { border-radius: 0.75rem; }
  .rounded-full { border-radius: 9999px; }

  /* Spacing utilities */
  .m-0 { margin: 0; }
  .m-1 { margin: 0.25rem; }
  .m-2 { margin: 0.5rem; }
  .m-3 { margin: 0.75rem; }
  .m-4 { margin: 1rem; }
  .mx-auto { margin-left: auto; margin-right: auto; }
  .my-2 { margin-top: 0.5rem; margin-bottom: 0.5rem; }
  .my-4 { margin-top: 1rem; margin-bottom: 1rem; }
  .mt-0 { margin-top: 0; }
  .mt-0\.5 { margin-top: 0.125rem; }
  .mt-1 { margin-top: 0.25rem; }
  .mt-2 { margin-top: 0.5rem; }
  .mt-3 { margin-top: 0.75rem; }
  .mt-4 { margin-top: 1rem; }
  .mt-6 { margin-top: 1.5rem; }
  .mt-8 { margin-top: 2rem; }
  .mt-12 { margin-top: 3rem; }
  .mt-16 { margin-top: 4rem; }
  .mb-1 { margin-bottom: 0.25rem; }
  .mb-2 { margin-bottom: 0.5rem; }
  .mb-3 { margin-bottom: 0.75rem; }
  .mb-4 { margin-bottom: 1rem; }
  .mb-6 { margin-bottom: 1.5rem; }
  .mb-8 { margin-bottom: 2rem; }
  .mb-12 { margin-bottom: 3rem; }
  .ml-1 { margin-left: 0.25rem; }
  .ml-2 { margin-left: 0.5rem; }
  .mr-1 { margin-right: 0.25rem; }
  .mr-2 { margin-right: 0.5rem; }
  .p-0 { padding: 0; }
  .p-1 { padding: 0.25rem; }
  .p-2 { padding: 0.5rem; }
  .p-3 { padding: 0.75rem; }
  .p-4 { padding: 1rem; }
  .p-6 { padding: 1.5rem; }
  .p-8 { padding: 2rem; }
  .p-12 { padding: 3rem; }
  .px-1 { padding-left: 0.25rem; padding-right: 0.25rem; }
  .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
  .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
  .px-4 { padding-left: 1rem; padding-right: 1rem; }
  .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
  .px-8 { padding-left: 2rem; padding-right: 2rem; }
  .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
  .py-1\.5 { padding-top: 0.375rem; padding-bottom: 0.375rem; }
  .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
  .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
  .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
  .py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
  .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
  .pt-2 { padding-top: 0.5rem; }
  .pt-4 { padding-top: 1rem; }
  .pt-6 { padding-top: 1.5rem; }
  .pt-8 { padding-top: 2rem; }
  .pb-2 { padding-bottom: 0.5rem; }
  .pb-4 { padding-bottom: 1rem; }
  .pb-6 { padding-bottom: 1.5rem; }
  .pl-2 { padding-left: 0.5rem; }
  .pl-6 { padding-left: 1.5rem; }
  .pl-10 { padding-left: 2.5rem; }
  .pr-2 { padding-right: 0.5rem; }
  .pr-3 { padding-right: 0.75rem; }
  .pr-4 { padding-right: 1rem; }
  .pr-8 { padding-right: 2rem; }

  /* Layout utilities */
  .block { display: block; }
  .inline { display: inline; }
  .inline-block { display: inline-block; }
  .hidden { display: none; }

  /* Opacity utilities */
  .opacity-0 { opacity: 0; }
  .opacity-50 { opacity: 0.5; }
  .opacity-60 { opacity: 0.6; }
  .opacity-100 { opacity: 1; }

  /* Cursor utilities */
  .cursor-pointer { cursor: pointer; }
  .cursor-default { cursor: default; }

  /* Pointer events */
  .pointer-events-none { pointer-events: none; }
  .pointer-events-auto { pointer-events: auto; }

  /* User select */
  .select-none { user-select: none; }
  .select-text { user-select: text; }

  /* Transition utilities */
  .transition { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
  .transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
  .transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
  .transition-opacity { transition-property: opacity; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
  .transition-transform { transition-property: transform; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
  .duration-200 { transition-duration: 200ms; }
  .duration-300 { transition-duration: 300ms; }
  .duration-500 { transition-duration: 500ms; }
  .ease-in-out { transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }

  /* Shadow utilities */
  .shadow { box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); }
  .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
  .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
  .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
  .shadow-inner { box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06); }

  /* Filter utilities */
  .backdrop-blur-sm { backdrop-filter: blur(4px); }
  .backdrop-blur-md { backdrop-filter: blur(12px); }
  .backdrop-blur-xl { backdrop-filter: blur(24px); }

  /* Focus utilities */
  .focus\:outline-none:focus { outline: 2px solid transparent; outline-offset: 2px; }
  .focus\:ring-2:focus { box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); }
  .focus\:ring-blue-500:focus { box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); }
  .focus\:not-sr-only:focus { position: static; width: auto; height: auto; padding: 0; margin: 0; overflow: visible; clip: auto; white-space: normal; }

  /* Hover utilities */
  .hover\:bg-slate-500:hover { background-color: #64748b; }
  .hover\:bg-slate-600:hover { background-color: #475569; }
  .hover\:bg-slate-600\/50:hover { background-color: rgba(71, 85, 105, 0.5); }
  .hover\:bg-slate-700:hover { background-color: #334155; }
  .hover\:bg-slate-700\/50:hover { background-color: rgba(51, 65, 85, 0.5); }
  .hover\:bg-slate-700\/90:hover { background-color: rgba(51, 65, 85, 0.9); }
  .hover\:bg-blue-600:hover { background-color: #2563eb; }
  .hover\:bg-blue-700:hover { background-color: #1d4ed8; }
  .hover\:text-white:hover { color: #ffffff; }
  .hover\:text-slate-300:hover { color: #cbd5e1; }
  .hover\:text-blue-300:hover { color: #93c5fd; }
  .hover\:text-blue-400:hover { color: #60a5fa; }
  .hover\:border-slate-500:hover { border-color: #64748b; }
  .hover\:shadow-lg:hover { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
  .hover\:scale-105:hover { transform: scale(1.05); }
  .hover\:scale-\[1\.01\]:hover { transform: scale(1.01); }

  /* Active utilities */
  .active\:scale-95:active { transform: scale(0.95); }

  /* Disabled utilities */
  .disabled\:opacity-50:disabled { opacity: 0.5; }
  .disabled\:cursor-not-allowed:disabled { cursor: not-allowed; }

  /* Group utilities */
  .group:hover .group-hover\:opacity-100 { opacity: 1; }
  .group:hover .group-hover\:scale-110 { transform: scale(1.1); }

  /* Screen reader utilities */
  .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0; }
  .not-sr-only { position: static; width: auto; height: auto; padding: 0; margin: 0; overflow: visible; clip: auto; white-space: normal; }

  /* Responsive utilities */
  @media (min-width: 640px) {
    .sm\:flex { display: flex; }
    .sm\:hidden { display: none; }
    .sm\:inline { display: inline; }
    .sm\:h-16 { height: 4rem; }
    .sm\:w-auto { width: auto; }
    .sm\:max-w-none { max-width: none; }
    .sm\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .sm\:flex-row { flex-direction: row; }
    .sm\:items-center { align-items: center; }
    .sm\:justify-between { justify-content: space-between; }
    .sm\:justify-start { justify-content: flex-start; }
    .sm\:gap-0 { gap: 0; }
    .sm\:space-x-4 > * + * { margin-left: 1rem; }
    .sm\:px-0 { padding-left: 0; padding-right: 0; }
    .sm\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
    .sm\:py-0 { padding-top: 0; padding-bottom: 0; }
    .sm\:mt-0 { margin-top: 0; }
    .sm\:text-xl { font-size: 1.25rem; line-height: 1.75rem; }
    .sm\:text-sm { font-size: 0.875rem; line-height: 1.25rem; }
  }

  @media (min-width: 768px) {
    .md\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  }

  @media (min-width: 1024px) {
    .lg\:grid-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
    .lg\:px-8 { padding-left: 2rem; padding-right: 2rem; }
  }

  @media (min-width: 360px) {
    .xs\:inline { display: inline; }
    .xs\:text-lg { font-size: 1.125rem; line-height: 1.75rem; }
  }

  /* Print utilities */
  @media print {
    .print\:hidden { display: none !important; }
  }

  /* Animation utilities */
  .animate-spin { animation: spin 1s linear infinite; }
  .animate-fade-in { animation: fadeIn 0.5s ease-in-out; }
  .animate-fade-in-panel { animation: fadeInPanel 0.5s ease-in-out; }

  /* Scrollbar utilities */
  .scrollbar-thin::-webkit-scrollbar { width: 8px; height: 8px; }
  .scrollbar-thin { scrollbar-width: thin; }

  /* Focus-visible utilities */
  .focus-visible\:outline-none:focus-visible { outline: none; }
  .focus-visible\:ring-2:focus-visible { box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); }

  /* Loading spinner utilities */
  .spinner {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  .spinner-lg {
    width: 3rem;
    height: 3rem;
    border-width: 4px;
  }

  /* Other utilities */
  .antialiased { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
  .scroll-smooth { scroll-behavior: smooth; }
  .break-inside-avoid { break-inside: avoid; }
  .tabular-nums { font-variant-numeric: tabular-nums; }
  .placeholder-slate-400::placeholder { color: #94a3b8; }
  .relative { position: relative; }
  .absolute { position: absolute; }
  .fixed { position: fixed; }
  .sticky { position: sticky; }
  .static { position: static; }
  .uppercase { text-transform: uppercase; }
  .capitalize { text-transform: capitalize; }
  .appearance-none { -webkit-appearance: none; -moz-appearance: none; appearance: none; }
  .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
  .top-0 { top: 0; }
  .top-1\/2 { top: 50%; }
  .top-2 { top: 0.5rem; }
  .top-4 { top: 1rem; }
  .top-full { top: 100%; }
  .left-0 { left: 0; }
  .left-1\/2 { left: 50%; }
  .left-3 { left: 0.75rem; }
  .left-4 { left: 1rem; }
  .right-0 { right: 0; }
  .right-2 { right: 0.5rem; }
  .right-3 { right: 0.75rem; }
  .bottom-0 { bottom: 0; }
  .bottom-4 { bottom: 1rem; }
  .bottom-full { bottom: 100%; }
  .z-10 { z-index: 10; }
  .z-50 { z-index: 50; }
  .overflow-hidden { overflow: hidden; }
  .overflow-auto { overflow: auto; }
  .overflow-x-auto { overflow-x: auto; }
  .overflow-visible { overflow: visible; }
  .transform { transform: translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)); }
  .-translate-x-1\/2 { --tw-translate-x: -50%; transform: translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)); }
  .-translate-y-1\/2 { --tw-translate-y: -50%; transform: translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)); }
  .scale-95 { --tw-scale-x: .95; --tw-scale-y: .95; transform: translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)); }
  .scale-105 { --tw-scale-x: 1.05; --tw-scale-y: 1.05; transform: translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)); }
  .scale-110 { --tw-scale-x: 1.1; --tw-scale-y: 1.1; transform: translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)); }
  .rotate-180 { --tw-rotate: 180deg; transform: translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)); }

  /* Cursor and interaction */
  .cursor-pointer { cursor: pointer; }
  .cursor-default { cursor: default; }
  .pointer-events-none { pointer-events: none; }

  /* Misc utilities */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  .not-sr-only {
    position: static;
    width: auto;
    height: auto;
    padding: 0;
    margin: 0;
    overflow: visible;
    clip: auto;
    white-space: normal;
  }
  .whitespace-nowrap { white-space: nowrap; }
  .break-inside-avoid { break-inside: avoid; }
  .opacity-60 { opacity: 0.6; }

  /* Finding-specific styles */
  .finding-result {
    margin-bottom: 1.5rem;
    cursor: pointer;
  }

  .finding-result:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }

  /* Responsive grid utilities */
  .grid { display: grid; }
  .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
  .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .grid-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }

  /* Font family utilities */
  .font-mono { font-family: var(--font-family-mono); }
  .font-sans { font-family: var(--font-family-sans); }

  /* Shadow utilities */
  .shadow { box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); }
  .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }

  /* Responsive utilities */
  @media (min-width: 640px) {
    .sm\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .sm\\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
  }

  @media (min-width: 768px) {
    .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  }

  @media (min-width: 1024px) {
    .lg\\:grid-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
    .lg\\:px-8 { padding-left: 2rem; padding-right: 2rem; }
  }

  /* Scale transform utilities */
  .scale-\\[1\\.01\\] { transform: scale(1.01); }
  .hover\\:scale-\\[1\\.01\\]:hover { transform: scale(1.01); }
  .hover\\:shadow-lg:hover { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
`;

export const ANIMATION_STYLES = `
  /* Custom animations */
  @keyframes fadeInPanel {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
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

  @keyframes fadeOutBlack {
    0% {
      opacity: 1;
      filter: brightness(1);
      background: #0f172a;
    }
    100% {
      opacity: 0;
      filter: brightness(0);
      background: #000000;
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .animate-fade-in {
    animation: fadeIn 0.6s ease-out;
  }

  .animate-fade-out-black {
    animation: fadeOutBlack 0.35s forwards;
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
    TAILWIND_UTILITIES,
    COMPONENT_STYLES,
    SEARCH_STYLES,
    UTILITY_STYLES,
    ANIMATION_STYLES,
  ];

  if (offlineMode) {
    styles.unshift(EMBEDDED_FONTS_CSS);
  }

  return styles.join("\n\n");
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
