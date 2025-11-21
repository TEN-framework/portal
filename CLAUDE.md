# CLAUDE.md - TEN Portal

This file provides guidance to Claude Code (claude.ai/claude-code) when working with this codebase.

## Project Overview

TEN Portal is a Next.js documentation and marketing website for the TEN Framework ecosystem (https://theten.ai). It provides documentation, blog posts, and community content for TEN, an open-source framework for conversational voice AI agents.

## Tech Stack

- **Framework**: Next.js 16.0.1, React 19.2.0
- **Language**: TypeScript 5.9.3 (strict mode)
- **Package Manager**: Bun 1.1+
- **Node.js**: v22+
- **Documentation**: Fumadocs (MDX-based)
- **Styling**: Tailwind CSS 4, shadcn/ui
- **i18n**: next-intl (English & Chinese)
- **Linting/Formatting**: Biome 2.3
- **Search**: Orama
- **Deployment**: Netlify

## Common Commands

```bash
bun dev                           # Start development server
bun build                         # Production build
bun start                         # Start production server
bun lint                          # Run Biome linter with auto-fix
bun check                         # Full check (lint + validate links)
bun run lint:links                # Validate internal/external links
bun run scripts:sync-remote-docs  # Sync docs from remote TEN Framework repo
```

## Project Structure

```
/app                    # Next.js app directory
  /(api)/               # API routes (search, github-stars, og images)
  /[lang]/              # i18n dynamic routes
    /(home)/            # Homepage, blog, hackathon
    /docs/              # Documentation pages (Fumadocs)
    /guide/             # Getting started guides
    /workshop/          # Workshop content

/content                # Markdown/MDX content
  /docs/                # Documentation with i18n
    /ten_framework/     # Synced from remote TEN Framework repo
  /blog/                # Blog posts

/components             # React components
  /ui/                  # shadcn/ui components
  /layout/              # Layout components
  /mdx/                 # MDX-specific components

/lib                    # Utilities & helpers
  i18n.ts               # i18n configuration
  source.ts             # Fumadocs source loader
  utils.ts              # cn() utility

/scripts                # Build & automation
  /sync-remote-docs/    # Remote doc sync feature

/messages               # i18n translations
  en.json, cn.json

/.source/               # Generated content sources (auto-generated)
```

## Code Style & Conventions

### Formatting (Biome)
- Indentation: 2 spaces
- Line width: 80 characters
- Quotes: Single
- Semicolons: As needed
- Trailing commas: None
- Arrow parentheses: Always

### React Patterns
- Server Components by default (async)
- Use `"use client"` selectively for interactive features
- Components co-located in feature folders (e.g., `_components/`)

### Styling
- Tailwind CSS utility-first approach
- Use `cn()` utility from `@/lib/utils` for class merging
- CSS variables for theming (OkLCh color format)
- Custom "Jokker" font family

### Path Aliases
```typescript
@/.source  → ./.source/index.ts
@/*        → ./*
```

## Key Configuration Files

- `source.config.ts` - Fumadocs configuration & content schema
- `next.config.mjs` - Next.js config with Fumadocs MDX integration
- `biome.json` - Linting & formatting rules
- `proxy.ts` - Middleware for i18n & format negotiation
- `components.json` - shadcn/ui configuration

## Important Patterns

### Content Management
- Documentation in `/content/docs` with frontmatter schema
- Blog posts in `/content/blog` with author, date, cover metadata
- Meta files (`meta.json`) define navigation structure
- Fumadocs auto-generates `.source/` on `bun install`

### i18n
- Routes: `/en/*`, `/cn/*` (default `/en/` prefix hidden)
- Translations in `/messages/{en,cn}.json`
- Fumadocs i18n for language selectors

### Remote Documentation Sync
- Manual GitHub Actions workflow syncs from `TEN-framework/ten-framework`
- Script in `scripts/sync-remote-docs/`
- Syncs to `content/docs/ten_framework/`

## Before Submitting PRs

1. Run `bun run check` (lints, formats, validates links)
2. Ensure build passes: `bun build`
3. No ESLint/Prettier needed - Biome handles all formatting

## Notes

- PostInstall hook auto-generates `.source/` directory
- Remote images supported from AWS S3 (ten-framework-assets.s3.amazonaws.com)
- Turbopack enabled for faster development builds
- Content drives most site value - documentation is primary focus
