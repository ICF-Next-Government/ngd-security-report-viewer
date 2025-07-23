# Development Guidelines

This guide ensures consistent coding standards, tooling, and workflows.

## Commands

- Check `package.json`, `Makefile`, `compose.yml`, or similar for commands (e.g., install, build, test).
- Use Bun for monorepo package management.

## Code Style

- **Module System**: Use ES Modules with TypeScript.
- **Path Aliases**: Use `@/*` for app-specific imports, `~/*` for monorepo packages; see `tsconfig.json`.
- **Module Structure**:
  - Place modules in `ModuleName/ModuleName.ts` (`.tsx` for JSX only).
  - Use `index.ts` (or `index.tsx` for JSX) as the single export point.
  - Export components as `export const ModuleName = () => {}`; use appropriate exports for non-components.
- **Styling**:
  - Use Tailwind CSS unless impractical.
  - Use `ModuleName.module.css` for custom CSS only if Tailwind is insufficient.
- **TypeScript**:
  - Use `type`, not `interface`.
  - Use `as const` for constants, not `enum`.

## React Development

- **Imports**: Use destructured imports only (e.g., `import { useState, useEffect } from 'react'`). Never import React default export or use `React.<foo>` namespace.
- **HTML Components**: Create fully typed React components for each HTML element, matching TypeScript HTML element props.
- **Refs**: Support fully typed `React.Ref` for all HTML React components.
- **Nested Components**: Use `<Component.SubComponent>` for nested HTML elements (e.g., `ul`, `ol`, `li`, `dd`, `dt`). Ensure `<Component>` is usable standalone. Avoid `<ComponentSubComponent>` naming.

## Workflow

- **Branch Naming**: Use prefixes: `feat/` (features), `fix/` (bugs), `hotfix/` (urgent), `release/` (releases), `chore/` (maintenance).
- **Code Validation**: Type check, lint, and periodically build to ensure type safety and build integrity.
- **Testing**: Run tests to validate changes.
- **Commits**: Write concise messages with 1-3 sentence summary (≤1500 characters) and bullet points for details.
- **Cleanup**: Review changes, remove unused references, fix warnings/errors, add comments only for complex/ambiguous code.
- **Documentation**: Avoid creating `.md` files unless requested. If no `CHANGELOG.md` exists, prompt user to create one; if approved, use Keep a Changelog format. Otherwise, update existing `CHANGELOG.md`.
- **Code Examples**: Avoid sample code unless requested.
