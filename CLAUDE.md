# Development Guidelines

This guide ensures consistent coding standards, tooling, and workflows.

## Commands

- Check `package.json`, `Makefile`, `compose.yml`, or similar (if present) for commands (e.g., install, build, test).
- Use Bun for monorepo package management.

## Code Style

- **Module System**: Use ES Modules with TypeScript.
- **Path Aliases**: Use `@/*` (project root) and `@/packages/*` (monorepo packages) for consistent imports; see `tsconfig.json` for definitions.
- **Module Structure**:
  - Place modules in `ModuleName/ModuleName.ts` (`.tsx` for JSX only).
  - Use `index.ts` (or `index.tsx` for JSX) as the single export point.
  - Export components as `export const ModuleName = () => {}`; use appropriate exports for non-components.
- **Styling**:
  - Use Tailwind CSS unless impractical.
  - Use `ModuleName.module.css` for custom CSS only if Tailwind is insufficient.
- **TypeScript**:
  - Use `type`, not `interface`, for type definitions.
  - Use `as const` for constants, not `enum`.

## React Development

- **HTML Components**: Create fully typed React components for each HTML element, matching TypeScript HTML element props.
- **Refs**: Support fully typed `React.Ref` for all HTML React components.
- **Nested Components**: Use `<Component.SubComponent>` for nested HTML elements (e.g., `ul`, `ol`, `li`, `dd`, `dt`). Ensure `<Component>` is usable standalone. Avoid `<ComponentSubComponent>` naming.

## Workflow

- **Branch Naming**: Use prefixes: `feat/` (features), `fix/` (bug fixes), `hotfix/` (urgent fixes), `release/` (release changes), `chore/` (maintenance).
- **Code Validation**: Type check, run linting, and periodically build (per `package.json` or similar) to ensure type safety and build integrity post-changes.
- **Testing**: Run tests (per `package.json` or similar) to validate changes.
- **Commits**: Write concise commit messages with a 1-3 sentence summary (≤1500 characters) and bullet points for details.
- **Documentation**:
  - Avoid creating `.md` files unless requested.
  - Update `CHANGELOG.md` (if present) in Keep a Changelog format (e.g., Added, Changed, Fixed) with concise, detailed commit changes.
- **Code Examples**: Avoid sample code unless requested.
