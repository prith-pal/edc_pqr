---
name: feature_plan_draft
description: Phase 1 of 4. Draft a plan packet for one `_features/` ticket with the read-only `feature_planner` subagent, then save it to `.agents/runs/<id>/plan.v<N>.md`.
argument-hint: <ticket-id>
disable-model-invocation: true
---

# Draft a Plan

Input: a ticket id such as `003`, from `$ARGUMENTS`.

1. Find the run folder `.agents/runs/<id>/` (create it if missing).
2. Pick the version `N`:

   | Folder state | N | Action |
   |:--|:--|:--|
   | No `plan.v*.md` | 1 | Draft |
   | Highest `plan.v<K>.md` has no `plan_review.v<K>.md` | — | Stop: `plan v<K> awaits review (/feature_plan_review <id>)` |
   | `plan_review.v<K>.md` verdict is `APPROVE` | — | Stop: `plan v<K> approved, next: /feature_implement_draft <id>` |
   | `plan_review.v<K>.md` verdict is `REQUEST_CHANGES`, K = 2 | — | Stop: `round cap reached, the human decides` |
   | `plan_review.v<K>.md` verdict is `REQUEST_CHANGES`, K = 1 | 2 | Redraft |

3. Spawn the `feature_planner` subagent with this task message only:
   `Ticket <id>, version <N>.` plus, for `N >= 2`,
   `Previous plan: .agents/runs/<id>/plan.v<K>.md. Its review: .agents/runs/<id>/plan_review.v<K>.md.`
   Pass nothing else: no summary of this conversation, no opinion about the ticket.
4. If the result starts with `BLOCKED:`, report it and stop.
5. Write the result verbatim to `.agents/runs/<id>/plan.v<N>.md`. Never edit or overwrite an earlier version.
6. End with two lines: the plan path, then `next: /feature_plan_review <id>`.

## Never
- Edit the packet yourself. A bad packet gets redrafted, not patched.
- Touch code, branches, or GitHub in this phase.
