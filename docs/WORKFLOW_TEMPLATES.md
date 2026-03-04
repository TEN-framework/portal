# Workflow Templates

Use the matching workflow for each task. If uncertain, default to `fix` and clarify assumptions.

Global rule: update `PROJECT_STATE.md` at each phase boundary.

## `feat` (new feature/page/behavior)

Entry checks:
1. Does this add a page/route?
2. Does this add new config or data sources?
3. Does this require new copy/i18n keys?

Minimum inputs:
- target route/module
- expected behavior and acceptance criteria

Action checklist:
- [ ] Confirm routing and folder conventions
- [ ] Reuse existing components when possible
- [ ] Add or update config/types
- [ ] Update locale messages when needed
- [ ] Run `bun lint` and relevant checks

Done criteria:
- behavior meets acceptance criteria
- lint passes

## `fix` (bug fix/regression)

Entry checks:
1. Is it reproducible?
2. Is there an error log or failing behavior trace?
3. Is it tied to a recent change?

Minimum inputs:
- reproducible steps
- expected vs actual behavior
- affected page/component/api

Action checklist:
- [ ] Locate trigger path and ownership boundary
- [ ] Apply minimal safe fix
- [ ] Run targeted regression checks
- [ ] Run `bun lint`

Done criteria:
- bug no longer reproduces
- no new regressions observed

## `refactor` (structure/maintainability)

Entry checks:
1. Does external behavior remain unchanged?
2. Should this be split into phases?

Minimum inputs:
- refactor goal and scope
- invariants that must not change

Action checklist:
- [ ] Define boundaries and invariants
- [ ] Apply small reversible steps
- [ ] Validate behavior equivalence
- [ ] Update related docs if contracts changed

Done criteria:
- external behavior preserved
- checks pass (`bun lint`, optionally `bun build`)

## `chore` (tooling/dependency/config)

Entry checks:
1. Does this involve dependency upgrades?
2. Does this impact build/deploy/CI?

Minimum inputs:
- target dependency or config
- reason and risk profile

Action checklist:
- [ ] Apply dependency/config updates
- [ ] Run `bun run check`
- [ ] Run `bun build` when build behavior may change
- [ ] Document compatibility impact

Done criteria:
- change is effective and reproducible
- key scripts succeed
