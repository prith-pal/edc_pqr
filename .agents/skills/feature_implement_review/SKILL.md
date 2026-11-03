---
name: feature_implement_review
description: Phase 4 of 4. Review one ticket's PR with a blind reviewer seat, save the report to `.agents/runs/<id>/implement_review.v<N>.md`, and post it to the PR as the `edc-review` GitHub App.
argument-hint: <ticket-id>
disable-model-invocation: true
---

# Review a Ticket PR

Input: a ticket id such as `003`, from `$ARGUMENTS`. Run folder: `.agents/runs/<id>/`.

Seat: the Claude `feature_reviewer` subagent. A Kilo seat (DeepSeek) becomes the primary seat in a later commit.

1. Pick the version: the highest `implement.v<N>.md`. Stop with `nothing to review, run /feature_implement_draft <id>`
   if none exists, or `v<N> already reviewed` if `implement_review.v<N>.md` exists.
2. Read the PR URL and `HEAD` from `implement.v<N>.md`. Read nothing else from it: the `RESOLVED` block is the author's
   claim and never reaches the reviewer. `<n>` is the PR number.
3. Find the approved plan: the highest `plan_review.v<P>.md` whose verdict is `APPROVE`.
4. Spawn the `feature_reviewer` subagent with this task message only:
   `Ticket <id>, version <N>. PR <n> at <sha>. Approved plan: .agents/runs/<id>/plan.v<P>.md.`
   plus, for `N >= 2`, `Your previous findings: .agents/runs/<id>/implement_review.v<N-1>.md.`
5. Write the result verbatim to `.agents/runs/<id>/implement_review.v<N>.md`.
6. Post the result to the PR. Every write uses the bot token, so it appears as `edc-review[bot]`.
   Every body ends with the footer `🤖 Adversarial review by Claude (local agent)`.
   - `REQUEST_CHANGES`: one review with one inline comment per finding. Anchor each comment on a new-file line
     inside the diff (`side: RIGHT`), or GitHub rejects it.
     ```sh
     GH_TOKEN=$(bun .agents/scripts/gh-app-token.ts) gh api repos/{owner}/{repo}/pulls/<n>/reviews --input - <<'JSON'
     {
       "commit_id": "<head sha>",
       "event": "REQUEST_CHANGES",
       "body": "Review v<N>: <k> blocking finding(s).\n\n🤖 Adversarial review by Claude (local agent)",
       "comments": [
         { "path": "<file>", "line": <line>, "side": "RIGHT",
           "body": "<finding, verbatim>\n\n🤖 Adversarial review by Claude (local agent)" }
       ]
     }
     JSON
     ```
   - `APPROVE`:
     ```sh
     GH_TOKEN=$(bun .agents/scripts/gh-app-token.ts) gh api repos/{owner}/{repo}/pulls/<n>/reviews \
       -f event=APPROVE -f commit_id=<head sha> \
       -f body=$'No blocking findings.\n\n🤖 Adversarial review by Claude (local agent)'
     ```
7. End with the verdict line, then the next step: `next: /feature_implement_draft <id>` (changes, N = 1),
   `the human decides` (changes, N = 2), or `the human merges` (approve).

## Never
- Write to the PR with the default `gh` token.
- Edit the report, or add findings the seat did not return.
- Print the token, or read anything under `~/.config/edc-review/`.
