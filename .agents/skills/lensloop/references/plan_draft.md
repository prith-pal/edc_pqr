# Draft a Plan

Input: a ticket id such as `003`.

1. Find the run folder `.agents/skills/lensloop/temp/<id>/` (create it if missing).
2. Pick the version `N`:

   | Folder state | N | Action |
   |:--|:--|:--|
   | No `plan_draft.v*.md` | 1 | Draft |
   | Highest `plan_draft.v<K>.md` has no `plan_review.v<K>.md` | — | Stop: `plan v<K> awaits review (/lensloop plan review <id>)` |
   | `plan_review.v<K>.md` verdict is `APPROVE` | — | Stop: `plan v<K> approved, next: /lensloop impl draft <id>` |
   | `plan_review.v<K>.md` verdict is `REQUEST_CHANGES`, K = 2 | — | Stop: `round cap reached, the human decides` |
   | `plan_review.v<K>.md` verdict is `REQUEST_CHANGES`, K = 1 | 2 | Redraft |

3. Read this phase's model in `.agents/skills/lensloop/references/slots.md`. Stop if it is missing.
   Spawn the `feature_plan_draft` subagent on that model, with this task message only:
   `Ticket <id>, version <N>.` plus, for `N >= 2`,
   `Previous plan: .agents/skills/lensloop/temp/<id>/plan_draft.v<K>.md. Its review: .agents/skills/lensloop/temp/<id>/plan_review.v<K>.md.`
   Pass nothing else: no summary of this conversation, no opinion about the ticket.
4. If the result starts with `BLOCKED:`, report it and stop.
5. Write the result verbatim to `.agents/skills/lensloop/temp/<id>/plan_draft.v<N>.md`. Never edit or overwrite an earlier version.
6. End with two lines: the plan path, then `next: /lensloop plan review <id>`.

## Never
- Edit the packet yourself. A bad packet gets redrafted, not patched.
- Touch code, branches, or GitHub in this phase.
