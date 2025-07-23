# Changelog

All notable changes to the NGD Security Report Viewer will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2025-01-10

### Added

- **Embedded Report Data**: HTML exports now include machine-readable data

  - Base64-encoded JSON summary in `data-report-summary` attribute
  - Contains timestamp, tool info, finding counts, and deduplication stats
  - Enables programmatic extraction for automation workflows

- **Enhanced Report Overview Section**: Redesigned the static HTML export's Report Overview
  - Minimal, compact design with professional appearance
  - Color-coordinated metric cards with matching icons and borders
  - Integrated Deduplication Analysis within the Overview card
  - Responsive layout optimized for all screen sizes
  - Improved visual hierarchy and spacing
  - Shield icon added to report header for better visual identity

### Changed

- **Simplified Export Architecture**: Removed polyglot HTML/shell script approach

  - HTML files are now standard, non-executable files
  - Cleaner implementation focused on data embedding
  - Improved security by removing executable components

- **Static HTML Export Improvements**
  - Updated card styling with subtle background colors
  - Improved typography with consistent white titles
  - Added visual separators between deduplication metrics
  - Enhanced hover states and transitions
  - Aligned icon positioning using proper flexbox layout
  - Normalized proportions between React app and static export

### Fixed

- **Tailwind CSS Classes**: Added missing border color utilities to static export styles
- **Border Rendering**: Fixed border colors appearing as white in exported HTML
- **Icon Background Colors**: Fixed missing background colors in static export by using inline styles
- **CSS Sizing Issues**: Added proper CSS reset and missing utility classes (w-1.5, h-1.5, gap-1.5, text-[10px])
- **Font Size Consistency**: Added text-size-adjust properties to prevent mobile browser font inflation
- **Severity Indicator**: Fixed missing colored dot next to severity level in static export

### Removed

- **Extraction Scripts**: Removed pre-built extraction scripts in favor of direct command usage
  - Users can extract data using standard Unix tools
  - Simplified maintenance and reduced complexity

## [1.1.0] - 2024-12

### Added

- **Modular HTML Generation Architecture**: Refactored monolithic system into focused modules

  - `index.ts`: Main orchestrator handling HTML generation
  - `styles.ts`: Centralized CSS and theming management
  - `summary.ts`: Report metadata and summary components
  - `findings.ts`: Individual and grouped findings rendering
  - `scripts.ts`: Interactive JavaScript functionality

- **Advanced Deduplication System**: Intelligent grouping of similar findings

  - Groups by rule ID, severity, and message similarity (85% threshold)
  - Interactive expand/collapse for grouped findings
  - Occurrence tracking with file location details
  - Significant noise reduction in security reports

- **Export as HTML Feature**: One-click export in ReportView component

  - Visual loading states during export
  - Error handling with user feedback
  - Browser compatibility checks
  - Automatic filename generation with date

- **Offline Font Support**: Embedded Inter font family
  - Weights: 400, 500, 600, 700
  - WOFF2 format with base64 encoding
  - Automatic injection during build process

### Changed

- **Code Organization**: Improved maintainability and structure

  - Split 886-line file into 5 focused modules
  - Enhanced TypeScript type safety
  - Better separation of concerns
  - Improved testability

- **Performance Enhancements**

  - Sub-millisecond HTML generation for typical reports
  - Debounced search functionality
  - Optimized DOM updates
  - Efficient deduplication algorithm

- **User Interface Updates**
  - Dark theme optimized for security reports
  - Responsive design for mobile and desktop
  - Smooth animations and transitions
  - Improved keyboard navigation

### Fixed

- **Parser Compatibility**: Fixed missing `severityCounts` in parsers

  - Updated Semgrep and GitLab SAST parsers
  - Added safe property access in HTML generation
  - Improved validation in React components

- **Static Export Styling**: Resolved styling issues in exported HTML
  - Added comprehensive Tailwind utility classes
  - Fixed layout and spacing inconsistencies
  - Ensured cross-browser compatibility

### Security

- **Gitleaks Integration**: Added `.gitleaks.toml` for secret detection
- **Client-side Processing**: All report processing happens in browser
- **XSS Prevention**: HTML content properly escaped
- **No External Dependencies**: Self-contained exported reports

## [1.0.0] - 2024-11

### Added

- Initial release of NGD Security Report Viewer
- Support for multiple report formats:
  - SARIF v2.1.0
  - Semgrep JSON
  - GitLab SAST
- Core features:
  - Interactive web interface
  - Basic deduplication
  - Search and filtering
  - Severity-based color coding
  - Static HTML export
  - Dark theme interface
  - Responsive design

---

## [Unreleased]

### Added

- Nothing yet

### Changed

- Nothing yet

### Fixed

- Nothing yet

## Summary

The NGD Security Report Viewer provides a modern, efficient way to analyze security findings from various scanning tools. Key capabilities include:

### Core Features

- **Multi-format Support**: Parse SARIF, Semgrep, and GitLab SAST reports
- **Smart Deduplication**: Reduce noise by grouping similar findings
- **Interactive UI**: Search, filter, and explore findings efficiently
- **Offline Reports**: Export self-contained HTML with embedded fonts and data
- **Professional Design**: Dark theme optimized for security workflows
- **Embedded Data**: Machine-readable JSON summary in every HTML export

### Technical Highlights

- **Modular Architecture**: Clean, maintainable codebase
- **TypeScript**: Full type safety throughout
- **Performance**: Fast parsing and rendering of large reports
- **Browser-based**: No server required, works entirely client-side
- **Responsive**: Works on desktop, tablet, and mobile devices

### Recent Improvements

- Enhanced Report Overview section with better visual design
- Improved deduplication with detailed occurrence tracking
- Better error handling and user feedback
- Comprehensive static HTML export functionality
- Optimized performance for large security reports
