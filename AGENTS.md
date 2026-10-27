# AGENTS.md — edc_pqr

Instructions for AI coding agents working in this repo.

## Purpose
A single-binary CLI for post-quantum resistant key generation, encryption and decryption.
Defaults must be safe without flags.

## Project Structure

```text
src/
  main.rs        entry point: parse args, dispatch, no logic
  <domain>/      one folder per concern (keygen/, encrypt/, ...)
    mod.rs       public surface of the domain
  shared/        used by 2+ domains, no domain knowledge
```

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
- Secrets never go in argv. Read passphrases and keys from stdin, files, or the keychain.
- No hand-rolled cryptography. Use audited crates only.

## Security Rules
<!-- TBD: algorithm choices, key file format, zeroization policy -->

## Testing
<!-- TBD -->
