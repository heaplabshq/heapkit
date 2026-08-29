# heapkit memory

## Coding style

- TypeScript strict mode (`noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`,
  `erasableSyntaxOnly`, `noFallthroughCasesInSwitch`). Use `import type` for type-only imports.
- Named exports for components and pages (no default exports for route components).
- Route components are lazy-loaded in `App.tsx` via
  `import('./pages/X').then(m => ({ default: m.X }))`.
- Tool logic is pure, framework-free functions in `src/lib/*.ts` (e.g. `formatJson`,
  `diffLines`, `generateUuid`). Keep React out of `lib/`.
- Styling is Tailwind v4 utility classes backed by design-token CSS custom properties defined
  in `src/index.css` (`@theme`). Use token utilities (`text-ink`, `border-border`,
  `bg-surface`, `bg-accent`) — never inline hex colors. Dark mode is handled by overriding the
  custom properties in a `prefers-color-scheme` media query, not by changing utility classes.
- UI primitives are small wrappers in `src/components/ui/` (Button, Checkbox, NumberField,
  TextArea, SegmentedControl, Card). Compose with `variant` props and a `className` escape hatch.
- Linting is Oxlint (`.oxlintrc.json`), not ESLint. `react/rules-of-hooks: error`.

## Architecture

- Single-page app: React 19 + Vite + React Router 7 (`BrowserRouter`), entry in `src/main.tsx`.
- `Layout` provides header nav + footer + `<Suspense>` outlet; all routes render inside it.
- Each tool is a page in `src/pages/` rendered through the shared `ToolPage` component, which
  enforces consistent structure: title, description, the interactive widget, an explanatory
  article, and an `AdSlot`. `ToolPage` calls `useDocumentMeta` to set title/meta/canonical.
- `useDocumentMeta` sets `document.title`, the description meta, and a canonical link pointing
  at `https://kit.heaplabs.dev` + the current path — SEO is a first-class concern per tool page.
- Multi-mode tools share one component across routes via an `initialMode` prop (e.g. `JsonTool`
  serves `/json-formatter`, `/json-validator`, `/json-diff`; `YamlTool` serves two routes).
- Ads are gated behind `VITE_ADSENSE_CLIENT_ID`; `AdSlot` renders nothing until set, so ads
  are a config change rather than a code change.
- Deploy target is Cloudflare Pages (`wrangler pages deploy dist --project-name=heapkit`).
- Planned monorepo (per REQUIREMENTS.md): `packages/core`, `apps-api/api`, `sdk/{python,node}`,
  `extensions/vscode`, `cli` — none built yet; each gated on demonstrated demand.

## Preferences

- Client-side processing by default — "nothing you paste is sent to a server" is both the
  privacy pitch and the cost-control mechanism. Don't add a backend without a roadmap gate.
- One core package over many micro-packages; split only on demonstrated demand.
- SEO-first: real explanatory content per tool, dedicated URL per tool, long-tail variant
  pages over head-on competition for saturated generic terms.
- Keep operating cost near zero ($0–20/mo); add servers/DBs only when a feature requires it.
- Brand is "Heap"; product codename is "heapkit"; npm scope is `@heapkit/*` (never bare
  `heapkit`); canonical site is `kit.heaplabs.dev`.
- Validate search demand with real data (Search Console) before building a new tool.