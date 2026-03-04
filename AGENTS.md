<!-- ai-coding-scaffold: v0.2.0 -->

# AGENTS.md

## Conversation Modes

Route each user turn into one mode:

| Mode | Trigger | Behavior |
|---|---|---|
| `workflow` | Explicit delivery tasks (`feat` / `fix` / `refactor` / `chore`) or any request requiring edits/commands | Start workflow state machine and maintain `PROJECT_STATE.md` |
| `continue` | "continue" intent or existing unfinished `PROJECT_STATE.md` | Resume from state file and proceed in `workflow` |
| `general` | Q&A, explanation, consultation | Answer directly; do not start workflow by default |

## Mode Switching Rule

When in `general`, if the response would require:
- file edits
- command execution
- todo/state changes

ask to switch to `workflow` mode before executing.

## Workflow Hard Gate

Before any development action in `workflow` mode:

1. Check `PROJECT_STATE.md`
- If missing: create from `docs/PROJECT_STATE_TEMPLATE.md`
- If present: update as needed

2. Output a state anchor line every workflow response:
- `[STATE] PROJECT_STATE.md: checked/updated`

No `[STATE]` line means workflow is not considered started.

## Multi-Role Routing (Risk Score)

Default role is `single`.

Score each dimension `0-2`:
1. Complexity (cross-module/cross-step logic)
2. Blast radius (shared interfaces/configs/critical paths)
3. Uncertainty (ambiguous requirements/design choices)
4. Change risk (migration/compatibility/rollback difficulty)
5. Verification cost (long or multi-path validation chain)

Routing thresholds:
- `0-3`: `single`
- `4-6`: `single` + mandatory reviewer pass
- `>=7`: full multi-role flow `planner -> executor -> reviewer`

## Freeze Discipline (v0.2.0)

- `ac-plan` (planner): writes `Execution Contract`, sets `PLAN_FROZEN=true`
- `ac-execute` (executor): requires `PLAN_FROZEN=true`, executes only contract scope
- `ac-review` (reviewer): validates Evidence/Gaps against contract; can unfreeze if needed

## Preferences

- Language: English
- Timezone: Asia/Shanghai
- Date format: `YYYY-MM-DD`
- Time format: 24-hour
- Primary tool: Codex
- Compatibility shell: Claude Code via `CLAUDE.md`

## PROJECT_STATE Rules (Mandatory)

State maintenance is part of execution, not optional.

For every workflow turn:
- Check if state needs updates (phase, Top 3, decisions, evidence, gaps)
- Output `[STATE] ...` even if no changes

Required update points:
- creating/updating todos
- completing todo items
- after commit
- phase transitions
- blockers/decisions
- lightweight edits included

`PROJECT_STATE.md` must contain:
- headers: `PLAN_FROZEN`, `CURRENT_ROLE`
- fixed sections:
1. Goal
2. Top 3 Next Actions
3. Blockers
4. Key Decision Index (latest 3)
5. Decision Log (append-only)
6. Evidence
7. Gaps
8. Commit Plan
9. Execution Contract

## Commit Policy

- `git commit`: allowed only when explicitly requested by user
- default behavior: prepare changes without committing
- `git push`: forbidden unless explicitly requested and confirmed
- co-author footer format:
  - `Co-Authored-By: <llm-model>`
- `PROJECT_STATE.md` is normally not committed unless:
  - cross-session handoff is needed, or
  - user explicitly requests it

## Review Policy

After each completed todo item, perform self-review:
- code: logic, type safety, edge cases, side effects
- docs: factual correctness, clarity, command validity

Reference checklist: `docs/REVIEW_TEMPLATES.md`

## Context Handoff

If conversation becomes long or context risk is high:
1. pause execution
2. update `PROJECT_STATE.md`
3. commit only if explicitly requested
4. provide restart hint: "start a new chat and say `continue <task>`"

## Document Map

| Document | Purpose |
|---|---|
| `PROJECT_STATE.md` | Live execution state (required in workflow) |
| `docs/WORKFLOW_TEMPLATES.md` | Task-type workflow playbooks |
| `docs/PROJECT_STATE_TEMPLATE.md` | State file template |
| `docs/REVIEW_TEMPLATES.md` | Self-review checklist |
| `docs/ARCHITECTURE.md` | Project architecture baseline |

## Project Snapshot

TEN Portal is a Next.js documentation and marketing site for the TEN ecosystem, with MDX docs/blog content, bilingual routes (`en`/`cn`), and Netlify deployment.

## Tech Baseline

| Item | Value |
|---|---|
| Package manager | Bun (`bun.lock`) |
| Framework | Next.js 16 + React 19 + TypeScript |
| Routing | App Router (`app/[lang]/...`) |
| Styling | Tailwind CSS 4 + custom CSS + shadcn/ui |
| Lint/Format | Biome |
| i18n | `next-intl` + Fumadocs i18n |
| Deployment | Netlify |

## Core Constraints

1. Run `bun run check` before finalizing delivery.
2. Keep docs/content schema consistent with `source.config.ts`.
3. Preserve locale behavior (`en` default, `cn` secondary) and path compatibility.
4. Avoid unrelated refactors during fix-scope tasks.

## Naming and Style

- Use existing repository conventions per Biome.
- Preserve current directory semantics in `app/`, `components/`, `content/`, `lib/`.
- Prefer focused commits and minimal diff scope.

## Common Commands

```bash
bun dev
bun build
bun lint
bun run check
bun run lint:links
bun run scripts:sync-remote-docs
```
