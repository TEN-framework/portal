---
name: ac-plan
description: Plan and freeze workflow execution by creating an Execution Contract, setting PLAN_FROZEN/CURRENT_ROLE, and updating PROJECT_STATE decisions and Top 3. Use when starting workflow delivery, re-planning after unfreeze, or when scope/constraints change before execution.
---

1. Read `PROJECT_STATE.md`; create it from `docs/PROJECT_STATE_TEMPLATE.md` if missing.
2. Define goal, scope boundary, forbidden changes, and acceptance checks.
3. Fill `Execution Contract` completely:
- Scope
- Files to change
- Forbidden
- Steps
- Checks
- Commit plan
- Rollback note
4. Update `下一步 Top 3` and append `关键决策日志`.
5. Set `PLAN_FROZEN: true` and `CURRENT_ROLE: planner`.
6. Emit a `[STATE]` anchor and hand off to `$ac-execute`.

Hard rules:
- Do not implement feature changes in this skill.
- Do not hand off if Contract fields are incomplete.
