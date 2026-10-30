# Code Review Rubric

Used by three roles:

| Role | Uses this file to |
|:--|:--|
| `feature-worker` | Self-check before opening or updating a PR |
| `feature-reviewer` | Judge the PR and post findings |
| `feature-orchestrate` | Decide approve, another round, or stop |

## Inputs (reviewer reads only these)
- The ticket: `_features/<id>-<slug>.md`
- The PR diff
- This rubric

## What Counts as a Finding

Only **blocking** issues. Each one must fit a category:

| Category | Example |
|:--|:--|
| Correctness | Wrong exit code, wrong output stream, logic error, panic on valid input |
| Security | Secret in argv or logs, key file with wrong permissions, plaintext written on a failed decrypt, hand-rolled crypto |
| Missing test | An acceptance criterion or error path with no test |
| Unmet acceptance criterion | A checkbox in the ticket that the diff does not satisfy |

Not findings: style, naming taste, formatting (`cargo fmt` runs automatically), refactors outside the ticket,
"consider" suggestions, future features.

## Rules
- At most **3** findings per round. Pick the most severe.
- Every finding names the file and line, states the failure scenario, and gives a concrete fix.
- No findings = approve.
- Round 2 verifies the round-1 findings only. No new scope, unless a fix introduced a new blocking issue.
- After 2 rounds with blocking findings left: stop, label the PR `needs-human`.

## Finding Format

```text
[<category>] <file>:<line>
Failure: <input or state> -> <wrong result>
Fix: <the concrete change>
```

## Approval Criteria (orchestrator)
- [ ] The reviewer's latest round has no open findings.
- [ ] CI is green (`cargo fmt --check`, `clippy -D warnings`, `cargo test`).
- [ ] The ticket's `status` is `done` in the diff.
- [ ] PR title follows `CONTRIBUTING.md`.
