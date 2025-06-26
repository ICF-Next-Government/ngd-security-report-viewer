# Dev Guidelines

## Commands

- `bun i` - install deps
- Use Bun for monorepo

## Code Style

- ES modules, TypeScript
- `@/*` root, `@<n>/*` monorepo
- Components: `ComponentName/ComponentName.tsx` + `index.tsx`
- Export: `export const ComponentName = () => {}`
- CSS: `ComponentName.module.css` in component dir

## Workflow

- Branches: `feat/`, `bug/`, `chore/`
- Typecheck after changes
- Run single tests
- Clear commits with bullets
- Never create sample/example code unless requested
- Run `bun run lint` after changes to fix formatting/linting
- Ensure that after all changes app still builds and type checks still pass.
