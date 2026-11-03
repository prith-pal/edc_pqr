# Implement Review Rubric

Used by two seats:

| Seat | Uses this file to |
|:--|:--|
| `feature_implementer` | Self-check before opening or updating a PR |
| `feature_reviewer` | Judge the PR and return findings |

## Inputs (reviewer reads only these)
- The ticket: `_features/<id>-<slug>.md`
- The approved plan: `.agents/runs/<id>/plan.v<P>.md`
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
| Plan drift | The diff skips a planned change, or adds a change the approved plan does not cover |

Not findings: style, naming taste, formatting (`cargo fmt` runs automatically), refactors outside the ticket,
"consider" suggestions, future features.

## Rules
- At most **3** findings per version. Pick the most severe.
- Every finding names the file and line, states the failure scenario, and gives a concrete fix.
- No findings = approve.
- Version 2 verifies the version-1 findings only. No new scope, unless a fix introduced a new blocking issue.
- After version 2 with blocking findings left: stop, the human decides.

## Finding Format

```text
F<k> [<category>] [lens=<lens_NNN|none>] <file>:<line>
Failure: <input or state> -> <wrong result>
Fix: <the concrete change>
```

## Merge Criteria (human)
- [ ] The latest implement review is `APPROVE`.
- [ ] CI is green (`cargo fmt --check`, `clippy -D warnings`, `cargo test`).
- [ ] The ticket's `status` is `done` in the diff.
- [ ] PR title follows `CONTRIBUTING.md`.
