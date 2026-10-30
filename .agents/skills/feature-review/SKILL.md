---
name: feature-review
description: Adversarially review one ticket's pull request against `.agents/code_review.md`, then post blocking findings or an approval as the `edc-review` GitHub App. Use when given a ticket id and a PR to review.
argument-hint: <ticket-id> <pr-url>
---

# Review a Ticket PR

Input: a ticket id and a PR number or URL. They come from `$ARGUMENTS`, or from the task message when this
skill is preloaded into `feature-reviewer`. `<n>` below is the PR number.

## Inputs (only these)
- The ticket: `_features/<id>-*.md`
- The diff: `gh pr diff <n>`
- The rubric: `.agents/code_review.md`

Do not read `CONTRIBUTING.md` or `AGENTS.md`. Open a full source file only to confirm a suspected finding.

## Pick the Round

```sh
gh pr view <n> --json headRefOid -q .headRefOid
gh api repos/{owner}/{repo}/pulls/<n>/reviews --jq '[.[] | select(.user.login=="edc-review[bot]")] | length'
```

| Earlier bot reviews | Round |
|:--|:--|
| 0 | Round 1 |
| 1 | Round 2 |
| 2 or more | Post nothing, end with `VERDICT: needs-human` |

Every write below uses the bot token, so it appears as `edc-review[bot]`. Every body ends with the footer
`🤖 Adversarial review by Claude (local agent)`.

## Round 1
1. Judge the diff against the rubric. Keep at most 3 blocking findings, most severe first.
2. No findings: approve (below).
3. Otherwise post one `REQUEST_CHANGES` review with one inline comment per finding, in the rubric's
   finding format. Anchor each comment on a new-file line inside the diff (`side: RIGHT`), or GitHub rejects it.
   A missing test anchors on the changed line it should cover.
   ```sh
   GH_TOKEN=$(bun .agents/scripts/gh-app-token.ts) gh api repos/{owner}/{repo}/pulls/<n>/reviews --input - <<'JSON'
   {
     "commit_id": "<head sha>",
     "event": "REQUEST_CHANGES",
     "body": "Round 1: <k> blocking finding(s).\n\n🤖 Adversarial review by Claude (local agent)",
     "comments": [
       { "path": "<file>", "line": <line>, "side": "RIGHT",
         "body": "[<category>] <file>:<line>\nFailure: <input or state> -> <wrong result>\nFix: <the concrete change>\n\n🤖 Adversarial review by Claude (local agent)" }
     ]
   }
   JSON
   ```
4. End with `VERDICT: changes (<k>)`.

## Round 2
Verify the round-1 findings only. No new scope, unless a fix introduced a new blocking issue.

1. List the round-1 findings:
   ```sh
   gh api repos/{owner}/{repo}/pulls/<n>/comments \
     --jq '.[] | select(.user.login=="edc-review[bot]" and .in_reply_to_id==null) | {id, path, line: (.line // .original_line), body}'
   ```
2. Reply in each thread with `Verified fixed in <sha>.` or `Still open: <reason>.`:
   ```sh
   GH_TOKEN=$(bun .agents/scripts/gh-app-token.ts) gh api repos/{owner}/{repo}/pulls/<n>/comments/<id>/replies \
     -f body=$'Verified fixed in <sha>.\n\n🤖 Adversarial review by Claude (local agent)'
   ```
3. All fixed: approve (below).
4. Any still open: post a `REQUEST_CHANGES` review whose body lists them, end with `VERDICT: needs-human`.

## Approve

```sh
GH_TOKEN=$(bun .agents/scripts/gh-app-token.ts) gh api repos/{owner}/{repo}/pulls/<n>/reviews \
  -f event=APPROVE -f commit_id=<head sha> \
  -f body=$'No blocking findings.\n\n🤖 Adversarial review by Claude (local agent)'
```

End with `VERDICT: approve`.

## Never
- Write to the PR with the default `gh` token.
- Edit files, commit, push, or merge.
- Print the token, or read anything under `~/.config/edc-review/`.
