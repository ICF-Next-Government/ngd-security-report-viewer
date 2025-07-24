## Description

This PR implements GitHub Actions CI/CD workflows for the NGD Security Report Viewer application and updates all project dependencies to their latest compatible versions, establishing automated build and test pipelines for continuous integration.

## Type of Change

- [x] ✨ New feature (non-breaking change which adds functionality)
- [x] 🔧 Configuration change
- [x] ⚡ Performance improvement
- [x] 🧹 Code refactoring

## Related Issues

N/A - Infrastructure enhancement and dependency maintenance

## Changes Made

### GitHub Actions Implementation
- Added `ci.yml` workflow for continuous integration on feature branches and PRs to main
- Created reusable `_build.yml` workflow for building the application with Bun
- Created reusable `_test.yml` workflow for running Vitest tests
- Added `bin/ghactions/version` script to generate version metadata during builds
- Integrated TruffleHog security scanning for secret detection in the build process
- Configured workflows to use Bun package manager for consistency with the project

### Dependency Updates
- Updated **lucide-react** from `0.344.0` to `0.525.0` (major update with new icons)
- Updated **motion** from `12.23.7` to `12.23.9` (patch update)
- Updated **@types/bun** from `1.2.17` to `1.2.19`
- Updated **@types/react** from `18.3.11` to `18.3.23`
- Updated **@types/react-dom** from `18.3.0` to `18.3.7`
- Updated **@vitejs/plugin-react** from `4.3.2` to `4.7.0`
- Updated **autoprefixer** from `10.4.20` to `10.4.21`
- Updated **postcss** from `8.4.47` to `8.5.6`
- Updated **typescript** from `5.6.3` to `5.8.3`
- Updated **typescript-eslint** from `8.8.1` to `8.38.0`
- Updated **vite** from `5.4.8` to `5.4.19`

### Configuration Fixes
- Fixed `tsconfig.node.json` by adding `"allowJs": true` to support JavaScript configuration files

## Technical Details

### Workflow Structure
- **CI Workflow (`ci.yml`)**: 
  - Triggers on pushes to non-main branches and PRs targeting main
  - Orchestrates build and test workflows using reusable components
  - Passes deployment flag as "false" for CI builds

- **Build Workflow (`_build.yml`)**:
  - Installs Bun and project dependencies
  - Runs the production build
  - Performs security scanning with TruffleHog
  - Creates version metadata file with build information
  - Supports environment-specific configurations for future deployments

- **Test Workflow (`_test.yml`)**:
  - Installs Bun and project dependencies
  - Executes Vitest test suite
  - Runs after successful build completion

### Security Features
- TruffleHog integration scans entire branch for secrets
- Configured to detect both verified and unknown secrets
- Build fails if secrets are detected

### Version Tracking
- Creates `/version` file in dist directory with:
  - Git reference (branch/tag)
  - Commit SHA
  - Build number and ID
  - Timestamp

### Dependencies Not Updated
Maintained current versions for stability:
- React 18 (v19 available but has breaking changes)
- Tailwind CSS 3 (v4 available but has breaking changes)
- Biome 1 (v2 available)
- jsPDF 2 (v3 available)

## Testing

- [x] All existing tests pass (9 tests across 3 test suites)
- [x] Workflows tested across multiple commits
- [x] Build process completes successfully
- [x] Test workflow executes properly
- [x] Version file generation verified
- [x] Secret scanning operational
- [x] No TypeScript errors
- [x] No linting issues
- [x] Production build successful with font injection

### Build Metrics
- HTML: 0.48 kB (gzipped: 0.31 kB)
- CSS: 47.06 kB (gzipped: 8.20 kB) 
- JavaScript: 391.52 kB (gzipped: 114.98 kB)
- Embedded fonts: 91.4 kB

## Checklist

- [x] My code follows the project's style guidelines
- [x] I have performed a self-review of my own code
- [x] I have commented my code, particularly in hard-to-understand areas
- [x] My changes generate no new warnings
- [x] New and existing unit tests pass locally with my changes
- [x] All dependencies are at their latest compatible versions

## Additional Notes

- Workflows are designed to be extensible for future deployment pipelines
- The `deployable` flag in `_build.yml` is set to "false" for CI runs but can be enabled for deployment workflows
- AWS region configuration is parameterized with default to `us-east-1`
- All workflows use the latest stable action versions (e.g., `actions/checkout@v4`, `oven-sh/setup-bun@v2`)
- Dependencies updated conservatively to maintain stability while getting latest patches and features
- Created comprehensive documentation of all updates in `dependency-update-summary.md`
