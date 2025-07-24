# Development Guidelines

Ensures consistent coding standards, tooling, and workflows.

## Commands

- Check `package.json`, `Makefile`, `compose.yml`, or similar for commands.
- Use Bun for monorepo package management.

## Code Style

- **Module System**: ES Modules with TypeScript.
- **Path Aliases**: `@/*` (app-specific), `~/*` (monorepo packages); see `tsconfig.json`.
- **Module Structure**: All files use `ModuleName/ModuleName.ts` (`.tsx` for JSX only) with `index.ts[x]` as single export point.
- **Exports**: Components as `export const ModuleName = () => {}`; appropriate exports for non-components.
- **Styling**: Tailwind CSS (use `ModuleName.module.css` only if Tailwind insufficient).
- **TypeScript**: Use `type` not `interface`; use `as const` not `enum`.

## React Development

- **Components**: Functional only. Never class components. For Error Boundaries etc., use packages like `react-error-boundary`.
- **Imports**: Destructured only. No React default or `React.<foo>` namespace.
- **HTML Components**: Fully typed React components matching TypeScript HTML element props with `React.Ref` support.
- **Nested Components**: Use `<Component.SubComponent>` pattern. Ensure `<Component>` is usable standalone.

## Workflow

- **Branches**: `feat/`, `fix/`, `hotfix/`, `release/`, `chore/`.
- **Validation**: Type check, lint, and periodically build.
- **Testing**: Co-locate tests within module directories.
- **Commits**: 1-3 sentence summary (≤1500 characters) with bullet points for details.
- **Cleanup**: Remove unused references, fix warnings/errors, comment only complex/ambiguous code.
- **Documentation**: Avoid `.md` files unless requested. Prompt for `CHANGELOG.md` creation if missing; use Keep a Changelog format.
- **Code Examples**: Avoid unless requested.
