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
  - Only use custom CSS when Tailwind is insufficient.
- Always use Tailwind CSS for styles unless it is not reasonable, ideally all Tailwind.
- TypeScript: Never use `interface`, only use `type` when defining types.
- TypeScript: Never use `enum`, only use `as const` then needing to define constants.

## Workflow

- Branches: `feat/`, `bug/`, `chore/`
- Typecheck after changes
- Run single tests
- Clear commits with bullets
- Never create sample/example code unless requested
- Run `bun run lint` after changes to fix formatting/linting
- Ensure that after all changes app still builds and type checks still pass.
