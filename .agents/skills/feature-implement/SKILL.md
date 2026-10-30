---
name: feature-implement
description: Implement one `_features/` ticket end to end (branch, code, tests, ticket status, pull request), or apply review findings to its open PR. Use when given a ticket id to build or review findings to fix.
argument-hint: <ticket-id>
---

# Implement a Ticket

Input: a ticket id such as `003`. It comes from `$ARGUMENTS`, or from the task message when this skill is
preloaded into `feature-worker`.

## Round 1: Build and Open the PR

1. Read, in order: `_features/<id>-*.md`, `AGENTS.md`, `CONTRIBUTING.md`, `.agents/code_review.md`.
2. Stop with `BLOCKED: <reason>` if the ticket `status` is not `todo`, or a `depends_on` ticket is not `done`.
3. Branch from a fresh `main`. `<slug>` is the ticket filename after the id.
   ```sh
   git fetch origin main
   git switch -c feat/<id>-<slug> origin/main
   ```
4. Implement the ticket scope only. Tests, README usage and a CHANGELOG `[Unreleased]` line ship in the same PR.
5. Run the quality gate until it is green:
   ```sh
   cargo fmt --all --check
   cargo clippy --all-targets -- -D warnings
   cargo test
   ```
6. Self-check `git diff origin/main` against `.agents/code_review.md`. Fix every issue the rubric would flag.
7. In the ticket: tick each acceptance criterion the diff satisfies, set `status: done`.
8. Commit with explicit paths (`git add <path> ...`, never `-A` or `.`). Title: `<type>: [<id>] <title>`,
   with `type` and `title` from the ticket frontmatter.
9. Push and open the PR:
   ```sh
   git push -u origin HEAD
   gh pr create --base main --title "<type>: [<id>] <title>" --body "<body>"
   ```
   Body: a short summary, the acceptance criteria checklist, and anything the ticket's Notes ask to report.
10. Set `pr: <url>` in the ticket frontmatter, commit (`docs: [<id>] link PR in ticket`), push.
11. End the final message with the PR URL on its own line.

## Round 2: Apply Review Findings

Trigger: a follow-up message with review findings or a PR URL.

1. If the message does not list the findings, read the open ones from the review bot:
   ```sh
   gh api repos/{owner}/{repo}/pulls/<n>/comments \
     --jq '.[] | select(.user.login=="edc-review[bot]" and .in_reply_to_id==null) | {path, line: (.line // .original_line), body}'
   ```
2. Fix each finding on the same branch. Nothing beyond the findings.
3. Run the quality gate, commit (`fix: address review on <id>`), `git push`.
4. End with one line per finding: `fixed <path>:<line> in <sha>` or `disputed <path>:<line>: <reason>`.

## Never
- Push to `main`, force-push, merge, approve, or post as the review bot.
- Read or print anything under `~/.config/edc-review/`.
- Edit `.agents/` or other tickets.
