---
name: ac-execute
description: Execute a frozen workflow contract and collect evidence by implementing only approved scope/files and checks. Use when PLAN_FROZEN=true and Execution Contract is complete, then hand off to review.
---

1. Verify `PLAN_FROZEN=true` and `Execution Contract` completeness.
2. Set `CURRENT_ROLE: executor`.
3. Change only files listed in `Files to change`.
4. Follow `Steps` exactly and run required `Checks`.
5. Record results in `验收证据（Evidence）` and update Top 3 completion.
6. Hand off to `$ac-review`.

Unfreeze fallback (mandatory):
1. Stop execution immediately when new design/scope appears.
2. Append a decision log entry with date, decision, and impact.
3. Set `PLAN_FROZEN: false` and `CURRENT_ROLE: planner`.
4. Return to `$ac-plan` for a new Contract.

Hard rules:
- Do not add design alternatives during execution.
- Do not edit files outside the Contract scope.
