# Plan Packet

The contract between `feature_plan_draft` (author) and `feature_plan_review_*` (reviewer).
One packet per plan version, stored at `.agents/skills/lensloop/temp/<id>/plan_draft.v<N>.md` (local only, gitignored).

## Rules
- The packet must stand alone: `feature_plan_review_*` gets the ticket, this packet, and the repo, never the reasoning of `feature_plan_draft`.
- No narrative, no confidence statements ("this should work"), no pasted logs. Trimmed excerpts only.
- Every `CHANGES` item serves a `GOALS` item. A change that serves no goal is scope creep; a goal that no change delivers is a gap.
- `PRIOR_CHECKS` are claims. `feature_plan_review_*` re-runs them before trusting any result.
- Version 2 and later start with a `RESOLVED` block: one line per finding of the previous review.

## Format

```markdown
# Plan draft <id> v<N>

## RESOLVED (v2+ only)
- F1 -> <what changed in this version>
- F2 -> rejected: <evidence that the finding is wrong>

## TICKET
<id> <title> (`_features/<id>-<slug>.md`)

## GOALS
1. <acceptance criterion, checkable>

## APPROACH
<3–6 lines: the design, in order of execution>

## CHANGES
| File | Change | Goal |
|:--|:--|:--|
| `src/<domain>/mod.rs` | <what> | 1 |

## TESTS
| Test | Proves | Goal |
|:--|:--|:--|
| `<test name>` | <behavior> | 1 |

## RISKS
- <what could go wrong> -> <mitigation or probe>

## PRIOR_CHECKS
| Lens | Probe | Result |
|:--|:--|:--|
| <lens_NNN or none> | <command or source> | <trimmed result> |

## OPEN_QUESTIONS
- <question the human or `feature_plan_review_*` must answer, or "none">
```
