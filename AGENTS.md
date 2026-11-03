# AGENTS.md — edc_pqr

Instructions for AI coding agents working in this repo.

## Purpose
A single-binary CLI for post-quantum resistant key generation, encryption, and decryption.
Defaults must be safe without flags.

## Project Structure

```text
src/
  main.rs        entry point: parse args, dispatch, no logic
  <domain>/      one folder per concern (identity/, recipient/, encrypt/, decrypt/, ...)
    mod.rs       public surface of the domain
  shared/        used by 2+ domains, no domain knowledge
```

## Agent Framework

| Path | Purpose |
|:--|:--|
| `_features/<id>-<slug>.md` | Tickets. One ticket = one PR |
| `.agents/skills/lensloop/` | The whole method as one skill: `/lensloop <phase> <step> <id>`. `SKILL.md` routes to `references/`, which also holds the plan packet format, the rubrics, and the roster in `slots.md` |
| `.agents/skills/lensloop/agents/` | The agents that fill the slots. All are read-only except `feature_impl_draft` |
| `.agents/agents/` | One symlink per agent, because harnesses only register agents from here |
| `.agents/settings.json` | Deny rules and hooks |
| `.agents/skills/lensloop/lenses/` | Earned review practices: `active/`, `rejected/`, and the `last_lens_id` counter |
| `.agents/skills/lensloop/temp/<id>/` | Local only (gitignored): each phase's working files (`plan_draft.v1.md`, `plan_review.v1.md`, `impl_draft.v1.md`, `impl_review.v1.md`, ...) |
| `.agents/skills/lensloop/references/slots.md` | The single source of truth for each slot's model and effort |
| `.agents/scripts/` | This repo's own scripts: the review bot's token |
| `.claude/agents`, `.kilo/agents`, `.opencode/agents` | Symlinks to `.agents/agents`. These folders keep their own generated files |
| `.claude/skills`, `.claude/settings.json` | Symlinks into `.agents/`. Kilo and OpenCode read `.agents/skills` directly |
| `CONTRIBUTING.md` | Commit and PR title rules |

- `settings.json` hooks: `cargo fmt` and an absolute-home-path check after every edit; clippy + tests before an agent may finish.
- Never write absolute home paths (`/Users/<name>/…`, `/home/<name>/…`) into the repo. Use repo-relative or `~/` paths.

## Commands

| Task | Command |
|:--|:--|
| Format | `cargo fmt --all` |
| Lint | `cargo clippy --all-targets -- -D warnings` |
| Test | `cargo test` |

These three are the quality gate. README usage and a CHANGELOG `[Unreleased]` line ship in the same PR as a feature.

## Conventions
- Prefer plain structs and maps over clever idioms.
- More than 2 params -> one options struct with `..Default::default()`.
- Dispatch on a key -> a lookup table, not an `if/else` chain.
- Passphrases and keys never go in argv. Read them from stdin, files, or the keychain.
  Exception by design: `encrypt -t TEXT` takes plaintext in argv; the README documents that stdin is the safe path for secrets.
- No hand-rolled cryptography. Use audited crates only.

## Security Rules
<!-- TBD: algorithm choices, key file format, zeroization policy -->

## Testing
<!-- TBD -->
