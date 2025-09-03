Thank you for your interest in contributing to this project!

Local setup
- Prereqs: Node 22+, Bun 1.1+ installed
- Install: `bun install`
- Dev server: `bun dev`

Quality checks
- Typecheck: `bun run typecheck`
- Lint: `bun run lint`
- Format: `bun run format`

Submitting changes
- Run `bun run check` before opening a PR
- Open a PR to `main`; CI runs typecheck, lint, and build

Notes
- Content is powered by Fumadocs; `postinstall` generates `.source/`
- Use Biome for lint/format; no ESLint/Prettier configs are required
