---
name: ac-review
description: Review execution against the frozen Execution Contract, produce Evidence/Gaps, and decide pass or unfreeze. Use after ac-execute or at milestone acceptance gates.
---

1. Set `CURRENT_ROLE: reviewer`.
2. Compare actual changes against Contract:
- Scope
- Forbidden
- Steps
- Checks
3. Update `验收证据（Evidence）` with concrete proof.
4. Update `未验证清单（Gaps）` with residual risks and missing checks.
5. Decide outcome:
- Pass: keep `PLAN_FROZEN=true` and allow summary/submit prep.
- Fail: set `PLAN_FROZEN=false` and route back to `$ac-plan`.

Hard rules:
- Base conclusions on Contract and evidence only.
- Do not skip Gaps when any verification is missing.
