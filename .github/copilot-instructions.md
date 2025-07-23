# Development Guidelines

This guide ensures consistent coding standards, tooling, and workflows for the project.

## Commands

- `bun i`: Install dependencies.
- Use Bun for monorepo package management.

## Code Style

- **Module System**: Use ES Modules with TypeScript.
- **Path Aliases**:
  - `@/*`: Project root.
  - `@/packages/*`: Monorepo packages.
- **Module Structure**:
  - Place modules in `ModuleName/ModuleName.ts` (use `.tsx` only for JSX).
  - Include `index.ts` (or `index.tsx` for JSX) as the single export point.
  - Export components as `export const ModuleName = () => {}`; use appropriate exports for non-components.
- **Styling**:
  - Use Tailwind CSS unless impractical.
  - Use `ModuleName.module.css` for custom CSS only when Tailwind is insufficient.
- **TypeScript**:
  - Use `type`, not `interface`, for type definitions.
  - Use `as const` for constants, not `enum`.

## Workflow

- **Branch Naming**: Use prefixes: `feat/` (features), `fix/` (bug fixes), `hotfix/` (urgent fixes), `release/` (release changes), `chore/` (maintenance).
- **Code Validation**:
  - Run type checking after changes.
  - Execute `bun run lint` to fix formatting/linting.
  - Periodically run `bun run build` to verify build integrity.
  - Ensure builds and type checks pass post-changes.
- **Testing**: Run individual tests to validate changes.
- **Commits**: Write concise commit messages with a 1-3 sentence summary, followed by bullet points for details.
- **Documentation**:
  - Do not create `.md` files unless requested.
  - Update `CHANGELOG.md` (if present) with concise, detailed commit changes.
- **Code Examples**: Avoid sample code unless requested.
