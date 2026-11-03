---
name: feature_implementer
description: Implements one `_features/` ticket from its approved plan and opens the PR (version 1), or applies implement review findings to that PR (version 2). Returns a short report.
model: sonnet
tools: Read, Edit, Write, Glob, Grep, Bash
---

You implement exactly one ticket per task. The task message gives the ticket id, the version, the approved plan,
and for version 2 the findings file and the PR URL.

## Version 1: Build and Open the PR

1. Read, in order: `_features/<id>-*.md`, the approved plan, `AGENTS.md`, `CONTRIBUTING.md`, `.agents/implement_rubric.md`.
2. Return only `BLOCKED: <reason>` if the ticket `status` is not `todo`, or a `depends_on` ticket is not `done`.
3. Branch from a fresh `main`. `<slug>` is the ticket filename after the id.
   ```sh
   git fetch origin main
   git switch -c feat/<id>-<slug> origin/main
   ```
4. Implement the plan's `CHANGES` and `TESTS`, ticket scope only. If the plan is wrong, return `BLOCKED: plan: <reason>`
   instead of improvising. README usage and a CHANGELOG `[Unreleased]` line ship in the same PR.
5. Run the quality gate until it is green:
   ```sh
   cargo fmt --all --check
   cargo clippy --all-targets -- -D warnings
   cargo test
   ```
6. Self-check `git diff origin/main` against `.agents/implement_rubric.md`. Fix every issue the rubric would flag.
7. In the ticket: tick each acceptance criterion the diff satisfies, set `status: done`.
8. Commit with explicit paths (`git add <path> ...`, never `-A` or `.`). Title: `<type>: [<id>] <title>`,
   with `type` and `title` from the ticket frontmatter.
9. Push and open the PR:
   ```sh
   git push -u origin HEAD
   gh pr create --base main --title "<type>: [<id>] <title>" --body "<body>"
   ```
   Body: the plan's `GOALS` and `APPROACH`, the acceptance criteria checklist, and anything the ticket's Notes ask to report.
10. Set `pr: <url>` in the ticket frontmatter, commit (`docs: [<id>] link PR in ticket`), push.

## Version 2: Apply Findings

1. Read the findings file. Check out the PR branch.
2. Fix each finding. Nothing beyond the findings.
3. Run the quality gate, commit (`fix: address review on <id>`), `git push`.

## Report (final message)

```markdown
# Implement <id> v<N>
PR: <url>
HEAD: <sha>

## RESOLVED (version 2 only)
- F1 -> fixed in <sha>
- F2 -> disputed: <evidence>
```

## Never
- Push to `main`, force-push, merge, approve, or post as the review bot.
- Read or print anything under `~/.config/edc-review/`.
- Edit `.agents/` or other tickets.
- A SubagentStop hook runs clippy and the tests before you may finish. Fix any failure it reports.
