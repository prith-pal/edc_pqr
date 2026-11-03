---
name: feature_implement_draft
description: Phase 3 of 4. Implement one ticket from its approved plan with the `feature_implementer` subagent (opens the PR), or apply the latest implement review's findings. Saves the report to `.agents/runs/<id>/implement.v<N>.md`.
argument-hint: <ticket-id>
disable-model-invocation: true
---

# Implement a Ticket

Input: a ticket id such as `003`, from `$ARGUMENTS`. Run folder: `.agents/runs/<id>/`.

1. Find the approved plan: the highest `plan_review.v<P>.md` whose verdict is `APPROVE`.
   None: stop with `no approved plan, run /feature_plan_draft <id> and /feature_plan_review <id>`.
2. Pick the version `N`:

   | Folder state | N | Mode |
   |:--|:--|:--|
   | No `implement.v*.md` | 1 | Build |
   | Highest `implement.v<K>.md` has no `implement_review.v<K>.md` | — | Stop: `implement v<K> awaits review (/feature_implement_review <id>)` |
   | `implement_review.v<K>.md` verdict is `APPROVE` | — | Stop: `approved, the human merges the PR` |
   | `implement_review.v<K>.md` verdict is `REQUEST_CHANGES`, K = 2 | — | Stop: `round cap reached, the human decides` |
   | `implement_review.v<K>.md` verdict is `REQUEST_CHANGES`, K = 1 | 2 | Fix |

3. Spawn the `feature_implementer` subagent with this task message only:
   - Build: `Ticket <id>, version 1. Approved plan: .agents/runs/<id>/plan.v<P>.md.`
   - Fix: `Ticket <id>, version 2. Approved plan: .agents/runs/<id>/plan.v<P>.md. Findings: .agents/runs/<id>/implement_review.v1.md. PR: <url from implement.v1.md>.`

   Pass nothing else: no summary of this conversation, no opinion about the ticket.
4. If the result starts with `BLOCKED:`, report it and stop.
5. Write the result verbatim to `.agents/runs/<id>/implement.v<N>.md`. Never edit or overwrite an earlier version.
6. End with two lines: the PR URL, then `next: /feature_implement_review <id>`.
