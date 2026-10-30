# Contributing

## Workflow
- Each change starts as a ticket in `_features/<id>-<slug>.md`.
- One ticket = one pull request = one squash commit on `main`.
- Squash merge only. The squash commit title is the PR title.

## Commit and PR Titles

Titles follow [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/):

```text
<type>(<optional scope>): [<ticket id>] <title>
```

Examples:

```text
feat: [003] encrypt text and stdin to the default identity
fix: [004] exit 3 on truncated messages
feat(harness): add feature-review skill
chore(harness): link .claude to .agents
```

| Type | Use for |
|:--|:--|
| `feat` | A new user-facing capability |
| `fix` | A bug fix |
| `refactor` | A code change that neither fixes a bug nor adds a feature |
| `perf` | A performance improvement |
| `test` | Adding or fixing tests |
| `docs` | Documentation only |
| `build` | Build system or dependencies (`Cargo.toml`, `Cargo.lock`) |
| `ci` | CI workflows |
| `chore` | Maintenance outside `src/` and tests |
| `revert` | Reverting an earlier commit |

| Scope | Use for |
|:--|:--|
| (none) | Product work, usually with a `[<ticket id>]` |
| `harness` | The agent framework in `.agents/`: `feat(harness)` for skills, agents and the orchestrator; `chore(harness)` for plumbing (settings, links, scripts); `ci(harness)` for workflows |

- `<type>` for ticket work comes from the ticket's `type` frontmatter field.
- Harness work has no ticket id.
- Breaking changes add `!` after the type or scope: `feat(cli)!: …`.
- Commits during review may be informal (`fix: address review on 003`). The squash folds them.
- Keep the `Co-Authored-By` trailer of the agent that wrote the change.

## Quality Gate (every PR)

```sh
cargo fmt --all --check
cargo clippy --all-targets -- -D warnings
cargo test
```

- Tests, README usage and a CHANGELOG `[Unreleased]` line ship in the same PR as the feature.
