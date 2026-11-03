# Review a Plan Draft

Input: a ticket id such as `003`. Run folder: `.agents/skills/lensloop/temp/<id>/`.

Worker: the agent `feature_plan_review_approval`, run through Kilo on the model and effort in this phase's row of `.agents/skills/lensloop/references/slots.md`.

1. Pick the version: the highest `plan_draft.v<N>.md`. Stop with `nothing to review, run /lensloop plan draft <id>`
   if none exists, or `v<N> already reviewed` if `plan_review.v<N>.md` exists.
2. Confirm `kilo agent list` shows `feature_plan_review_approval`. If it does not, stop: Kilo falls back to its
   unrestricted default agent when `--agent` names an agent it cannot find.
   Read the model and effort from `slots.md`. Stop if either is missing.
   Run the worker from the repo root, with this message only:
   ```sh
   KILO_DISABLE_CLAUDE_CODE_PROMPT=1 kilo run --dir . --agent feature_plan_review_approval -m <model> --variant <effort> "<message>"
   ```
   The variable keeps the session's personal `CLAUDE.md` away from the blind worker.
   Message: `Ticket <id>, version <N>. Plan draft: .agents/skills/lensloop/temp/<id>/plan_draft.v<N>.md.`
   plus, for `N >= 2`, `Your previous findings: .agents/skills/lensloop/temp/<id>/plan_review.v<N-1>.md.`
   Pass nothing else: no summary of this conversation, no opinion about the plan.
   If the command fails, report the error and stop. Do not review the plan any other way.
3. Write the report verbatim to `.agents/skills/lensloop/temp/<id>/plan_review.v<N>.md`, starting at its `# Plan review` heading.
   Never edit or overwrite an earlier version.
4. End with the verdict line, then the next step: `next: /lensloop impl draft <id>` (approve),
   `next: /lensloop plan draft <id>` (changes, N = 1), or `the human decides` (changes, N = 2).

## Never
- Edit the report, or add findings the slot did not return.
- Touch code, branches, or GitHub in this phase.
