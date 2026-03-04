# Review Templates (Agent Self-Review)

Default mode is non-interactive: run review automatically and report conclusions.
Only switch to interactive review when the user explicitly asks.

## Review Modes

- Default: automatic review, concise findings
- Interactive trigger keywords: `detailed review`, `check item by item`, `expand review`

## Dialogue Quality Review (per response)

Checklist:
- [ ] Correct phase for current turn
- [ ] Output is convergent and actionable
- [ ] No repetition of already confirmed context
- [ ] Missing information handled as blocker, not guesswork

## Change Review (before final delivery)

Required:
- [ ] Changes stay within declared scope
- [ ] No unintended behavior shifts
- [ ] Lint/check commands run (or explicitly reported if not run)
- [ ] Verification method clearly reported

Optional when relevant:
- [ ] Shared components/config impact documented
- [ ] New dependencies justified
- [ ] Rollback guidance provided for risky changes

## Suggested Output Snippets

Progress line:

```text
Progress: design -> execution | round N | +A -B lines
```

Blocker line:

```text
Blocked: missing <required input>; cannot safely proceed.
```

Completion line:

```text
Review: pass / pass-with-risk / fail
Evidence: <commands + observed result>
Gaps: <remaining unverified items>
```
