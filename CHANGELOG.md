ngd-security-report-viewer/CHANGELOG.md
```
# Changelog
All notable changes to this project will be documented in this file.

This project adheres to [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]



### Added
- Lefthook integration for Git hooks management.
- Pre-commit hook to run Biome linter on staged JavaScript and TypeScript files and execute test suite.
- `prepare` script in package.json to automatically install Git hooks.
- Table of contents with clickable navigation links to README.md sections.

### Changed
- Updated README.md with correct repository URLs, Docker usage instructions, and improved development workflow documentation.
- Added missing commands to README.md including test running and fast build option.
- Enhanced project structure documentation to include configuration files.
- Initial `CHANGELOG.md` file following Keep a Changelog format.
- Integration of `react-error-boundary` for robust error handling.
- Timestamp display in report view header for improved context.
- Severity level dropdown and input field height alignment for consistent UI.
- Highest severity level display in report summary ("Severity Level" replaces "Security Score").
- Centered loader icon and text in landing page loading overlay.
- Improved spacing and visual hierarchy in Recent Report card.
- Vertical pipe separators for supported formats on landing page.
- Type-only import support for React `FC` in components.
- Static HTML export functionality for reports.
- Path alias support for `@` and `~` in Vite and Vitest.
- Global test setup to ensure React is always in scope for all tests.

### Changed
- Refactored legacy class-based `ErrorBoundary` to a functional component using `react-error-boundary`.
- Updated all React imports to use destructured imports, removing default and namespace imports.
- Replaced all TypeScript `interface` and `enum` usage with `type` and `as const` per repo standards.
- Updated report summary to show highest severity level instead of qualitative score.
- Changed "Security Score" label to "Severity Level" for clarity.
- All usages of `React.FC` replaced with type-only imports (`import type { FC } from "react"`) for compliance and runtime safety.
- Test configuration and setup files updated to ensure React context is injected automatically for all tests.
- Improved UI consistency and spacing across landing and report views.
- Updated loader and spinner visuals for clarity.

### Fixed
- Loader and spinner alignment issues in landing and report views.
- Inconsistent spacing between file/json section and Recent Report card.
- Severity dropdown height mismatch with input field in findings filter.
- `React is not defined` errors in tests by injecting React into global test setup.
- Test reliability for ReportView and ErrorBoundary by ensuring React context and correct mock types.
- Path alias resolution issues in tests.
- Mock data type mismatches in tests.

### Removed
- Legacy React patterns and non-compliant code per repo guidelines.
- Default and namespace React imports from all components.

### Testing
- Added and refined tests for major components (LandingPage, ReportView, ErrorBoundary).
- Mocked browser APIs for jsdom compatibility in tests.
- Improved test coverage for error boundaries and UI rendering.
- Suppressed jsdom "uncaught error" logs for cleaner test output.
- Ensured all tests pass with automatic React context.

### Documentation
- Updated and maintained `CHANGELOG.md` in Keep a Changelog format.
- Added actionable release notes and developer guidance.

### Infrastructure
- Ensured Vite and Vitest configs support automatic JSX runtime and path aliases.
- Added global test setup for React context and browser API mocks.

---

## [0.1.0] - 2024-06-XX

### Added
- Initial release of NGD Security Report Viewer.
- SARIF, Semgrep, and GitLab SAST report support.
- Tailwind CSS-based UI.
- File upload and JSON paste functionality.
- Severity breakdown, deduplication, and findings list.
- Export to static HTML report.

---

**Note:** For future releases, add new entries under "Unreleased" and move them to a new version section when released.