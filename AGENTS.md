# Agent notes

This is a **Vite + React + TypeScript** SPA, deployed to **Cloudflare Workers Static Assets** (no server runtime).

## Stack

- React 18 + TypeScript (strict)
- Vite 6
- Wrangler 3 / Workers Static Assets
- No CSS framework — design tokens + plain CSS in `src/styles/`

## Conventions

- Path alias: `@/*` → `src/*`
- All visible class names use the `td-*` prefix (mirrors the design bundle)
- Inline styles are acceptable for one-off layout — design tokens (`var(--td-*)`) are the source of truth for colors/spacing/typography
- No global state; sections are pure presentational components

## Out of scope (intentionally removed from the previous Next.js iteration)

- next.js, opennext, tailwind, next-intl, react-three-fiber, playwright
- All server-side rendering — this is a static SPA

## Things to keep working

- Build: `npm run build` produces `dist/` consumable by Wrangler Static Assets
- Type-check: `npm run typecheck` must pass
- The `tigerduck.app/*` route mapping in `wrangler.jsonc` is load-bearing
