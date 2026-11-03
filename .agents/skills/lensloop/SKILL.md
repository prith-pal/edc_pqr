---
name: lensloop
description: Runs the lensloop review flow on one `_features/` ticket. A draft writes the work, then a blind reviewer judges it, from another model family where the roster has one. Commands are `/lensloop <phase> <step> <ticket-id>`, covering plan draft, plan review, impl draft, and impl review. Use only when the human asks to run a phase.
argument-hint: <phase> <step> <ticket-id>
---

# lensloop

Find the row the request names, read its file, and follow it. Read no other phase file.

| Command | File |
|:--|:--|
| `/lensloop plan draft <id>` | `references/plan_draft.md` |
| `/lensloop plan review <id>` | `references/plan_review.md` |
| `/lensloop impl draft <id>` | `references/impl_draft.md` |
| `/lensloop impl review <id>` | `references/impl_review.md` |

- Accept any wording that clearly names a row, such as `plan_draft` or "review the plan for 003".
- If the phase or the ticket is unclear, check `.agents/skills/lensloop/temp/`, suggest the likely next step, and ask.
- Each phase file's paths are relative to the repo root.
