# heapkit — Long-Term Passive Income Developer Toolkit

## Status

Working requirements doc. Brand: **Heap** (umbrella, consistent with existing heapcode / heapedit / heapchat products). Product name for this platform: **heapkit**.

**Name availability (checked 2026-07-18):**

| Asset | Status |
|---|---|
| `heapkit.dev` | Available (confirmed via registry RDAP) |
| `heapkit.io` | Available (confirmed via registry) |
| npm `heapkit` (bare) | Taken — unrelated small priority-queue/data-structure package, different domain, low collision risk but avoid the bare name anyway |
| npm `@heapkit/*` scope | Available |
| PyPI `heapkit` / `heapkit-core` | Available |
| GitHub org `heapkit` | Available |

**Done (2026-07-19):** the `heaplabs` GitHub org name was already taken, so the umbrella org was registered as **`heaplabshq`** instead — holds `heapkit`, `heapcode`, `heapchat` (transferred); `heapedit` transfer still pending. Publish npm packages under the `@heapkit/*` scope, never a bare `heapkit` package.

**Domain strategy — superseded 2026-07-18:** heapkit isn't the only product under the Heap brand — heapcode, heapedit, and heapchat exist too (deployed already, no custom domain yet). Registering `heapkit.dev` alone would mean repeating that cost for each sibling product. A bare `heap.<tld>` umbrella domain isn't available anywhere checked (`.dev`/`.io`/`.app`/`.xyz`/`.co`/`.sh`/`.wtf`/`.zone`/`.digital` all taken — `.io` is Heap Analytics, a 10,000+ customer product-analytics company, and the others are likely defensively registered around it).

Decided: **`heaplabs.dev`** as a shared umbrella domain (available, checked 2026-07-18), with each product on its own subdomain, one shared registration instead of four:

```
heaplabs.dev          → portfolio page listing all Heap products
kit.heaplabs.dev       → heapkit
code.heaplabs.dev      → heapcode
edit.heaplabs.dev      → heapedit
chat.heaplabs.dev      → heapchat
```

Each subdomain attaches independently to its own Cloudflare Pages project (separate repos, separate deploys) — only the DNS zone is shared. `heapkit.dev`/`.io` are no longer the plan; every domain reference below should be read as `kit.heaplabs.dev` until this doc's URLs are updated.

**Known trade-off, accepted:** a keyword-rich root domain (`heapkit.dev`) is arguably marginally better for organic search than a subdomain of a less-relevant parent — Google generally treats subdomains as close to independent sites, but it's not a fully settled question. Traded off deliberately here for a 4x cost reduction across the whole product portfolio; revisit only if `kit.heaplabs.dev` demonstrably underperforms a root-domain competitor once there's real Search Console data to compare against.

**Done:** `heaplabs.dev` is registered, added as a Cloudflare zone, and `kit.heaplabs.dev` is attached as a custom domain on the `heapkit` Pages project (live, confirmed 2026-07-19).

---

## Vision

heapkit is a free, high-quality developer-tools website that generates long-term organic traffic while keeping operating costs near zero. Every tool is client-side-first, SEO-optimized, and shares one codebase so new tools are cheap to add.

The original plan tried to launch a website, npm/PyPI SDKs, a REST API, a CLI, and a VS Code extension all in the first phases. That's the wrong order for a solo/small-team passive-income project: **none of those surfaces matter until the website proves it can rank and hold organic traffic.** This doc keeps the same end-state ecosystem but gates each new surface behind evidence that the previous one is working.

---

## Core Principles

* Low operating cost (target: $0–20/month through the early stages)
* SEO-first, but validated with real keyword data before building — not assumed
* Evergreen utilities, no login required, fast, mobile-friendly
* Client-side processing by default ("your data never leaves your browser") — doubles as a privacy/trust marketing angle *and* keeps compute cost at zero
* One brand (Heap), one product codename (heapkit) for this platform
* Reusable code: one core logic package, not a dozen micro-packages, until there's real demand to split
* AI only where it adds real value, BYOK (bring your own key) so inference is never a cost center

---

## Reality Check: Why This Plan Changed

**1. The niche is saturated.** JSON formatter, Base64, UUID generator, JWT decoder, etc. are dominated by sites with 10+ years of domain authority and backlinks (jsonformatter.org, freeformatter.com, base64decode.org, and similar). Ranking #1 for the exact generic term ("json formatter") head-on is unrealistic in year one. The plan needs a differentiation and long-tail strategy, not just "build the tool and wait."

**2. Ad revenue on developer traffic is low.** Developers run ad-blockers at high rates, so AdSense RPM on this audience is typically $1–3, sometimes less. Passive income here comes from *volume over years* plus diversified monetization (Sponsors, a paid API tier, donations) — not from AdSense alone at moderate traffic. Set expectations accordingly: this is a 12–24 month runway to meaningful income, not a quick win.

**3. Building five distribution surfaces (web, npm, PyPI, REST API, CLI, VS Code extension) before validating even one tool wastes effort.** Every unvalidated surface is maintenance burden with no payoff if the underlying tool never gets traffic. The fix: prove the website converts organic search into repeat/engaged traffic first, *then* extract and distribute.

**4. Fragmenting into many tiny packages (`heap-json`, `heap-yaml`, `heap-regex`, `heap-openapi`) upfront multiplies publishing/versioning/maintenance overhead for zero benefit at low usage.** Start with one core package with internal modules; split a module out only when it has independent demand (issues, download requests).

---

## Competitive Scan (checked 2026-07-18)

Quick search-result audit of the 10 initial tools, ranked easiest → hardest to win long-tail traction against:

* **UUID generator** — moderately crowded (uuidgenerator.net, uuidtools.com, and several mid-tier newcomers), no single overwhelming leader. Most winnable of the ten head-on.
* **Base64 encode/decode** — old, high-authority exact-match domains (base64decode.org, base64encode.org) are hard to beat on the bare term, but long-tail variants (base64-to-image, base64-to-file, URL-safe base64) are far less contested and are the real opportunity here.
* **JSON formatter/validator** — heavily saturated (jsonformatter.org, jsonlint.com, freeformatter.com, codebeautify.org, jsoneditoronline.org). Notably, newer entrants (json.site, json-indent.com) already lead with "100% client-side / private / in-browser" — **this means client-side processing is table stakes in this category now, not a unique differentiator.** Win here needs long-tail variants (json-to-yaml, json-to-csv) + bundled multi-mode pages + real content depth, not the positioning alone.
* **JWT decoder** — many competent entrants (token.dev, javainuse.com, 10015.io), most already claim local/browser-only decoding. Same table-stakes dynamic as JSON.
* **Cron builder** — **crontab.guru** is a minimal, extremely well-loved, high-authority incumbent for the "describe this cron expression" use case. Going head-on for "cron expression generator" is hard, but a genuinely visual builder (pick days/times from a UI, not type-and-parse) is a different enough interaction model to be worth building rather than a clone.
* **Regex tester** — dominated by **regex101.com** and **regexr.com**, both feature-rich (multi-language flavors, live explanations, saved pattern libraries, huge community mindshare). This is the single hardest tool of the ten to win head-on — deprioritize it relative to the others, or scope it narrowly (e.g. a specific regex-explain angle) rather than a general tester.

**Important finding — a direct ecosystem-level competitor exists:** [IT-Tools](https://github.com/CorentinTh/it-tools) (CorentinTh) is an open-source, self-hosted collection of 70+ developer tools (UUID, JSON, cron, and many more) with a strong UX reputation and real GitHub traction. This is not a legacy single-tool SEO site — it's a modern "one platform, many tools" project occupying almost the same niche as the whole heapkit thesis, not just one tool category.

The structural difference to lean on: IT-Tools is a client-routed single-page app — great UX once you're on the site, but each tool isn't an independently content-rich, individually indexable page, which limits its per-tool organic search footprint. heapkit's SEO-first, dedicated-URL-per-tool-with-real-content approach is a structural advantage for organic discovery even where feature parity is close. Worth using IT-Tools' tool list as inspiration for Phase 2 expansion, but the win condition is search discoverability, not just feature breadth.

---

## Differentiation Strategy (new — the original plan had none)

Because head-on competition for generic terms is hard, win on:

* **Long-tail, programmatic pages** instead of one generic page per tool: e.g. not just `/json-formatter` but `/json-to-yaml`, `/json-to-csv`, `/base64-to-image`, `/uuid-v4-generator` vs `/uuid-v7-generator`. Long-tail keywords have far less competition and compound across dozens of variants from the same underlying logic.
* **Client-side-only processing as a trust signal** — "nothing you paste is ever sent to a server" is both true (keeps costs at zero) and a real differentiator most competitors don't lead with, especially for JWT/JSON payloads that often contain sensitive data.
* **Multi-tool bundling per page** (e.g. the JSON page offers format + validate + diff + minify as tabs of one tool, not four separate thin pages) — increases pages-per-session and dwell time, both of which help organic ranking, and reduces content dilution.
* **Real explanatory content per tool** (what the format is, common errors, edge cases) instead of a bare textbox — this is what search engines and users actually reward over a bare utility with no context.

---

## The heapkit Ecosystem (end state — not all built at once)

```text
Heap (brand)
└── heapkit (product)
    ├── Web Platform        ← build first, validate here
    ├── Core Library        ← extract once web tools are stable
    ├── REST API            ← only once there's pull for programmatic access
    ├── CLI                 ← thin wrapper over Core Library
    ├── VS Code Extension   ← thin wrapper, doubles as a discovery/marketing channel
    ├── Documentation
    ├── Blog
    ├── AI Tools (BYOK)
    └── Future Mobile/Desktop Apps
```

---

## Website

`heapkit.dev` is the primary traffic engine and, for a long time, the *only* surface.

Each tool page:

* Own URL, SEO-optimized content (real explanation, not just a widget)
* Fast load, mobile support, no login
* Client-side processing wherever feasible
* Long-tail variant pages generated from the same underlying logic

Initial tool set (~8–10, not 20 — ship a tight set, learn from Search Console, then expand):

```
/json-formatter        /json-validator        /json-diff
/yaml-validator         /base64                /uuid-generator
/hash-generator         /jwt-decoder           /regex-tester
/cron-builder
```

Additional tools (XML, SQL formatter, OpenAPI viewer, Markdown preview, etc.) get added in Phase 2+ based on which categories show impressions/clicks in Search Console — not built speculatively upfront.

---

## Technology Stack

**Frontend:** React, Vite, TypeScript, Tailwind CSS
**Backend (only once needed for API/hosted features):** Cloudflare Workers; FastAPI (Python) if a heavier compute need justifies it
**Database (only once needed):** Cloudflare D1 or Turso; Supabase only if relational/auth needs grow
**Hosting:** Cloudflare Pages (frontend, free), Cloudflare Workers (API), Cloudflare R2 (storage)
**Analytics:** Cloudflare Web Analytics, Google Analytics, Google Search Console (Search Console is the most important one — it's the validation signal for every later phase)

Estimated monthly cost through Phase 2: **$0–20**.

---

## Monorepo Structure

```text
heapkit/
apps/
    web/          # the site — the only thing that matters early on
    docs/         # added in Phase 4
apps-api/
    api/          # added in Phase 4, not before
packages/
    core/         # ONE package with internal modules (json, yaml, regex, etc.)
sdk/
    python/       # added in Phase 3
    node/         # added in Phase 3
extensions/
    vscode/       # added in Phase 5
cli/              # added in Phase 5
```

---

## Revenue Strategy

**Stage 1 (Phase 1–2):** Google AdSense, GitHub Sponsors, donations. Expect low RPM — this stage is about proving traffic exists, not extracting revenue.

**Stage 2 (Phase 4+, once there's demonstrated API demand):** Hosted API with a free tier + metered paid tier, premium features (saved snippets/workspaces), team collaboration.

**Stage 3 (long-term):** Enterprise API, sponsorships, partner integrations, AI premium features.

Don't build Stage 2/3 monetization infrastructure before Stage 1 proves there's an audience to sell to.

---

## Roadmap (validation-gated)

### Phase 0 — Validate before building anything
* Keyword research (Google Keyword Planner / Search Console / Ahrefs free tools) for the initial 8–10 tools and their long-tail variants
* Confirm `heapkit.dev` (or `.io`) domain availability, npm scope, PyPI namespace, GitHub org
* Set up GA + Search Console + Cloudflare Analytics before writing any tool code

**Exit criteria:** domain + tracking live, keyword list prioritized by (demand ÷ competition).

### Phase 1 — Website MVP
* Build the 8–10 initial tools as client-side-only, no-login pages with real explanatory content
* Ship to `heapkit.dev`, submit sitemap, request indexing
* No SDKs, no API, no CLI, no extension yet

**Exit criteria:** pages indexed, at least some organic impressions showing in Search Console (give it 60–90 days).

### Phase 2 — Expand + content
* Add tool categories that show impressions/clicks signal in Search Console
* Build long-tail programmatic variant pages for the highest-traffic categories
* Start a blog targeting adjacent long-tail keywords
* Turn on AdSense once there's meaningful traffic to monetize

**Exit criteria:** consistent month-over-month organic traffic growth; a defensible set of ranking pages.

### Phase 3 — Extract the core library
* Pull shared logic into **one** `@heapkit/core` (npm) and `heapkit-core` (PyPI) package — not one package per tool
* Open source it: this is the GitHub-visibility/backlink play from the original plan, kept, but consolidated into one repo instead of four

**Exit criteria:** package published, basic docs, a handful of real (non-vanity) downloads.

### Phase 4 — REST API + docs site
* Expose the core package behind a Cloudflare Workers API, gated by rate limits on the free tier
* This is also where Stage 2 monetization (paid tier) starts being viable

**Exit criteria:** clear evidence of programmatic/CI use-case demand before investing here — e.g. users asking for it, or the CLI (below) driving API usage.

### Phase 5 — CLI + VS Code extension
* Thin wrappers over the same core package
* Treat both as *discovery channels* back to the website/brand as much as standalone utilities

### Phase 6 — AI features (BYOK)
* Add BYOK AI utilities (Explain Regex, Explain Stack Trace, Explain SQL, etc.) only once the core traffic engine is proven — this is the highest-complexity, lowest-necessity layer relative to the "evergreen, low-cost utility" thesis
* Supported providers: OpenAI, OpenRouter, Gemini, Anthropic, Ollama

---

## Long-Term Vision (aspirational, not committed roadmap)

```text
Heap
└── heapkit
    ├── 200+ Utilities
    ├── Python SDK / Node SDK
    ├── REST API / CLI / VS Code Extension
    ├── Documentation / Blog
    ├── AI Assistant (BYOK)
    ├── Browser Extension
    ├── Mobile App / Desktop App
```

---

## Guiding Principles

* Prove traffic before building distribution surfaces.
* Prefer long-tail, differentiated pages over head-on competition for saturated generic terms.
* Client-side processing by default — it's both the privacy pitch and the cost-control mechanism.
* One core package, split only on demonstrated demand.
* Validate search demand with real data before building a tool, not assumption.
* Keep infrastructure simple and inexpensive; add servers/DBs only when a feature requires them.
* Grow one trusted brand (Heap) instead of fragmenting across many unrelated names.

---

## Mission

Build the most useful developer toolkit on the web under the Heap brand, proving organic traffic and trust with a focused website first — then extend into libraries, API, CLI, and editor tooling only where real usage pulls it forward.
