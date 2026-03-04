# Architecture

## 1. Stack and Project Scope

- Repository model: single repository
- App type: Next.js web application (documentation + marketing + blog)
- Frontend framework: Next.js 16 (App Router) + React 19 + TypeScript
- Documentation system: Fumadocs (`fumadocs-core`, `fumadocs-mdx`, `fumadocs-ui`)
- Styling: Tailwind CSS 4, utility-first classes, custom global CSS, shadcn-style components
- i18n: `next-intl` + Fumadocs i18n with locales `en` and `cn`
- Search: Orama-based API route for docs search

## 2. Package Management and Toolchain

- Package manager: Bun (`bun.lock`)
- Runtime constraints: Node `>=22`, Bun `>=1.1.0`
- Lint/format: Biome (`bun lint`, `bun run check`)
- Build: `next build`
- Test framework: none detected in scripts (validation is lint + link checks + build)
- CI/CD:
  - Netlify deploy workflow (`.github/workflows/netlify-deploy.yml`)
  - Remote docs sync workflow (`.github/workflows/sync-remote-docs.yml`)
  - legacy CI file exists but disabled (`ci.yml.disabled`)

## 3. Runtime and Environment

- Primary commands:
  - `bun dev`
  - `bun build`
  - `bun start`
  - `bun run check`
- Netlify build config in `netlify.toml`:
  - build command: `npm run build`
  - publish dir: `.next`
  - plugin: `@netlify/plugin-nextjs`
- Postinstall bootstrap:
  - `scripts/postinstall.js` ensures platform native binaries and runs Fumadocs generation

## 4. External Integrations and Boundaries

- Remote image host allowed by Next image config:
  - `https://ten-framework-assets.s3.amazonaws.com/**`
- Remote docs synchronization:
  - syncs from `TEN-framework/ten-framework` into `content/docs/ten_framework/`
- Netlify edge functions and redirects defined in `netlify.toml`

## 5. Module Responsibilities and Structure

- `app/`
  - App Router entrypoints and route segments
  - localized routes in `app/[lang]/...`
  - API routes in `app/(api)/api/...`
- `components/`
  - shared UI/layout/mdx/domain components
- `content/`
  - source markdown/mdx for docs and blog
- `lib/`
  - i18n routing setup, source loaders, utilities
- `messages/`
  - locale message files (`en.json`, `cn.json`)
- `scripts/`
  - postinstall and docs sync scripts

## 6. Routing and Data Flow

- Localization:
  - route locale segment via `app/[lang]/...`
  - default locale `en`
- Middleware/proxy:
  - locale detection and i18n middleware
  - markdown preference rewrite path handling
- Docs and blog data flow:
  - `content/*` -> Fumadocs source loaders (`lib/source.ts`) -> route rendering
- Search data flow:
  - source index -> Orama search API route (`app/(api)/api/search/route.ts`)

## 7. Build and Deployment

- Build pipeline:
  - `prebuild` runs `scripts/postinstall.js`
  - build via Next.js output in `.next`
- Deploy targets:
  - Netlify preview on PR to `main`
  - Netlify production on push to `main`
- Docs sync pipeline:
  - manual workflow dispatch by target tag
  - auto branch + PR generation for synced docs

## 8. Constraints and Known Risks

- Locale contracts (`en`/`cn`) are coupled across routes, messages, and content.
- Docs sync automation depends on GitHub token permissions and upstream repo state.
- Current quality gates are lint/link-check/build; no dedicated automated test suite is configured.
- Build behavior depends on postinstall-generated artifacts (`.source`).

## 9. Update Record

- 2026-03-04: Initial AI Coding scaffold architecture baseline generated from repository scan.
