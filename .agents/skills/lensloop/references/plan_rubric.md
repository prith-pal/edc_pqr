# Plan Review Rubric

Used by two slots:

| Slot | Uses this file to |
|:--|:--|
| `/lensloop plan draft` | Self-check before returning a packet |
| `feature_plan_review_approval` | Judge the packet and return findings |

## Inputs (`feature_plan_review_*` reads only these)
- The ticket: `_features/<id>-<slug>.md`
- The plan draft: `.agents/skills/lensloop/temp/<id>/plan_draft.v<N>.md`
- The repo, to confirm a suspected finding
- This rubric

## What Counts as a Finding

Only **blocking** issues. Each one must fit a category:

| Category | Example |
|:--|:--|
| Unmet acceptance criterion | A ticket criterion that no `GOALS` item covers |
| Gap | A `GOALS` item that no `CHANGES` row delivers |
| Scope creep | A `CHANGES` row that serves no goal, or work outside the ticket |
| Missing test | A goal or error path with no row in `TESTS` |
| False claim | A `PRIOR_CHECKS` probe whose re-run contradicts the recorded result |
| Design flaw | An approach that cannot work: wrong API, unsafe default, hand-rolled crypto |

Not findings: style, naming taste, alternative designs that are only preferences, "consider" suggestions, future features.

## Rules
- At most **10** findings per version, most severe first. Blocking issues only: no padding to reach the limit.
- Every finding names the packet section, states the failure scenario, and gives a concrete fix.
- No findings = approve.
- Version 2 verifies the version-1 findings only. No new scope, unless a change introduced a new blocking issue.
- After version 2 with blocking findings left: stop, the human decides.

## Finding Format

```text
F<k> [<category>] [lens=<lens_NNN|none>] <packet section>
Failure: <input or state> -> <wrong result>
Fix: <the concrete change>
```
