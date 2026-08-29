# heapkit

Free, browser-only developer-tools website (JSON, YAML, UUID, Base64, hash, JWT, cron).
Client-side-first: nothing the user pastes is ever sent to a server. SEO-driven, one URL per
tool with real explanatory content. Deployed to Cloudflare Pages at `kit.heaplabs.dev`.

## Stack

- React 19 + TypeScript (strict) + Vite 8
- Tailwind CSS v4 (via `@tailwindcss/vite`); design tokens defined as CSS custom properties in
  `src/index.css` `@theme` block, with dark-mode overrides in a media query
- React Router 7 (BrowserRouter), lazy-loaded route components
- Oxlint for linting (no ESLint); Wrangler for Cloudflare Pages deploy
- No test framework configured yet

## Layout

```
REQUIREMENTS.md          # product/roadmap spec — read for context
apps/web/                # the only app that exists today
  src/
    App.tsx              # routes (lazy imports)
    main.tsx             # entry, BrowserRouter
    index.css           # Tailwind import + design tokens (light/dark)
    pages/               # one file per tool, each exports a named component
    components/          # Layout, ToolPage, CopyButton, ui/ (Button, Card, ...)
    lib/                 # pure tool logic (json, yaml, jwt, hash, cron, md5) + useDocumentMeta
  .oxlintrc.json
  vite.config.ts
  tsconfig.{app,node}.json
```

Planned (not yet built): `packages/core`, `apps-api/api`, `sdk/{python,node}`,
`extensions/vscode`, `cli`. See REQUIREMENTS.md for the validation-gated roadmap.

## Commands

All commands run from `apps/web/`:

```sh
npm run dev       # vite dev server
npm run build     # tsc -b && vite build
npm run preview   # preview built dist
npm run lint      # oxlint
npm run deploy    # build + wrangler pages deploy dist --project-name=heapkit --force
```

## Conventions

- Named exports for components/pages; routes lazy-load via `import(...).then(m => ({ default: m.X }))`.
- Tool pages use the shared `ToolPage` wrapper (title, description, meta, children, explain).
  Every tool page sets document title + meta description + canonical via `useDocumentMeta`.
- Tool logic lives in `src/lib/*.ts` as pure functions — keep it framework-free and testable.
- UI primitives live in `src/components/ui/`; use the design-token utility classes
  (`text-ink`, `border-border`, `bg-surface`, `bg-accent`, ...) — never hardcode hex colors.
- TypeScript strict: `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`,
  `erasableSyntaxOnly`. Use `import type` for type-only imports.
- No backend by default — all processing client-side. Add server surfaces only per roadmap gates.