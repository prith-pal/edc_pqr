# Implement a Ticket

Input: a ticket id such as `003`. Run folder: `.agents/skills/lensloop/temp/<id>/`.

1. Find the approved plan: the highest `plan_review.v<P>.md` whose verdict is `APPROVE`.
   None: stop with `no approved plan, run /lensloop plan draft <id> and /lensloop plan review <id>`.
2. Pick the version `N`:

   | Folder state | N | Mode |
   |:--|:--|:--|
   | No `impl_draft.v*.md` | 1 | Build |
   | Highest `impl_draft.v<K>.md` has no `impl_review.v<K>.md` | — | Stop: `impl v<K> awaits review (/lensloop impl review <id>)` |
   | `impl_review.v<K>.md` verdict is `APPROVE` | — | Stop: `approved, the human merges the PR` |
   | `impl_review.v<K>.md` verdict is `REQUEST_CHANGES`, K = 2 | — | Stop: `round cap reached, the human decides` |
   | `impl_review.v<K>.md` verdict is `REQUEST_CHANGES`, K = 1 | 2 | Fix |

3. Read this phase's model in `.agents/skills/lensloop/references/slots.md`. Stop if it is missing.
   Spawn the `feature_impl_draft` subagent on that model, with this task message only:
   - Build: `Ticket <id>, version 1. Approved plan: .agents/skills/lensloop/temp/<id>/plan_draft.v<P>.md.`
   - Fix: `Ticket <id>, version 2. Approved plan: .agents/skills/lensloop/temp/<id>/plan_draft.v<P>.md. Findings: .agents/skills/lensloop/temp/<id>/impl_review.v1.md. PR: <url from impl_draft.v1.md>.`

   Pass nothing else: no summary of this conversation, no opinion about the ticket.
4. If the result starts with `BLOCKED:`, report it and stop.
5. Write the result verbatim to `.agents/skills/lensloop/temp/<id>/impl_draft.v<N>.md`. Never edit or overwrite an earlier version.
6. End with two lines: the PR URL, then `next: /lensloop impl review <id>`.
