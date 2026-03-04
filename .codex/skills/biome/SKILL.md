---
name: biome
description: Enforce Biome formatting and lint discipline in this repository. Use when making any file edits, when asked to run format/lint, and immediately before any commit. Always execute `bun run lint` (from package.json), apply resulting fixes, and re-run until clean. Treat `bun run lint:links` as optional by default, and recommend it when files under `content/` are changed.
---

# Biome

## Required Policy

Apply this policy on every task in this repository:

1. Run `bun run lint` after making any file change.
2. Run `bun run lint` again immediately before any `git commit`.
3. Treat lint failures as blocking. Do not proceed to final delivery or commit until lint passes.

## Workflow

1. Make the requested code or content edits.
2. Execute:

```bash
bun run lint
```

3. If lint reports issues or rewrites files, review changed files and run `bun run lint` again until it exits cleanly.
4. If a commit is requested, run `bun run lint` one final time right before `git commit`.
5. Record lint execution in the task evidence/summary.

## Optional Link Check Policy

- Default: do not run `bun run lint:links`.
- If the change includes files under `content/`, recommend running `bun run lint:links`.
- If the user explicitly asks for full `check`, run `bun run check`.

## Guardrails

- Use `bun run lint` as the source of truth command (defined in `package.json` as `biome check --write`).
- Do not replace this with direct biome CLI variants unless user explicitly asks for a different command.
- Keep `bun run lint:links` optional unless `content/` changed or the user explicitly requests it.
- Keep lint-induced edits in scope; avoid unrelated refactors.
