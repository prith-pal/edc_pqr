# AGENTS.md — edc_pqr

Instructions for AI coding agents working in this repo.

## Purpose
A single-binary CLI for post-quantum resistant key generation, encryption and decryption.
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
| `.agents/` | Agent config: skills, subagents, `settings.json` (deny rules + hooks), `code_review.md` |
| `.claude` | Symlink to `.agents` |
| `CONTRIBUTING.md` | Commit and PR title rules |

- `settings.json` hooks: `cargo fmt` and an absolute-home-path check after every edit; clippy + tests before an agent may finish.
- Never write absolute home paths (`/Users/<name>/…`, `/home/<name>/…`) into the repo. Use repo-relative or `~/` paths.

## Commands

| Task | Command |
|:--|:--|
| Format | `cargo fmt --all` |
| Lint | `cargo clippy --all-targets -- -D warnings` |
| Test | `cargo test` |

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
