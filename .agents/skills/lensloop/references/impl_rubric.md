# Impl Review Rubric

Used by three agents:

| Agent | Uses this file to |
|:--|:--|
| `/lensloop impl draft` | Self-check before opening or updating a PR |
| `feature_impl_review_approval` | Judge the PR and return findings |
| `feature_impl_review_comment` | Leave comments only, with no verdict |

## Inputs (`feature_impl_review_*` reads only these)
- The ticket: `_features/<id>-<slug>.md`
- The approved plan: `.agents/skills/lensloop/temp/<id>/plan_draft.v<P>.md`
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

Not findings: style, naming taste, formatting, refactors outside the ticket,
"consider" suggestions, future features.

## Rules
- At most **10** findings per version, most severe first. Blocking issues only: no padding to reach the limit.
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
- [ ] The latest `impl_review.v<N>.md` is `APPROVE`.
- [ ] CI is green.
- [ ] The ticket's `status` is `done` in the diff.
- [ ] The PR title follows the project's rules, if it has them.
