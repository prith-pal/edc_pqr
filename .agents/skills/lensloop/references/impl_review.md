# Review a Ticket PR

Input: a ticket id such as `003`. Run folder: `.agents/skills/lensloop/temp/<id>/`.

Current slot: the `feature_impl_review_approval` subagent, on the session's model. Follow the steps below with this agent only.
Target roster and verdict rule, not built yet: `.agents/skills/lensloop/references/slots.md`.

## Steps

1. Pick the version: the highest `impl_draft.v<N>.md`. Stop with `nothing to review, run /lensloop impl draft <id>`
   if none exists, or `v<N> already reviewed` if `impl_review.v<N>.md` exists.
2. Read the PR URL and `HEAD` from `impl_draft.v<N>.md`. Read nothing else from it: the `RESOLVED` block is the claim of
   `feature_impl_draft` and never reaches `feature_impl_review_*`. `<n>` is the PR number.
3. Find the approved plan: the highest `plan_review.v<P>.md` whose verdict is `APPROVE`.
4. Spawn the `feature_impl_review_approval` subagent with this task message only:
   `Ticket <id>, version <N>. PR <n> at <sha>. Approved plan: .agents/skills/lensloop/temp/<id>/plan_draft.v<P>.md.`
   plus, for `N >= 2`, `Your previous findings: .agents/skills/lensloop/temp/<id>/impl_review.v<N-1>.md.`
5. Use your file-writing tool to save the result verbatim to `.agents/skills/lensloop/temp/<id>/impl_review.v<N>.md`.
6. End with the verdict line, then the next step: `next: /lensloop impl draft <id>` (changes, N = 1),
   `the human decides` (changes, N = 2), or `the human merges` (approve).

## Never
- Edit the report, or add findings the slot did not return.
- Post to GitHub. Publishing is up to the project.
