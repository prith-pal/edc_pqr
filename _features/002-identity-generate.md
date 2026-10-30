---
id: "002"
type: feat
title: identity generate creates the default identity
status: todo
depends_on: ["001"]
size: S
pr:
---

# 002: identity generate creates the default identity

## Goal
`edc_pqr identity generate` (alias `edc_pqr g`) creates one post-quantum key pair named `main_identity`.

## CLI

```sh
edc_pqr identity generate     # creates keys/main_identity.key + keys/main_identity.pub
edc_pqr g                     # same (top-level word alias)
```

- The identity name is hardcoded to `main_identity` in this ticket. Named identities come later.
- Key profile: v6, ML-DSA-65 + Ed25519 primary key, ML-KEM-768 + X25519 encryption subkey (see ticket 001).

## Config Dir
- `$EDC_PQR_DIR`, else `$XDG_CONFIG_HOME/edc_pqr`, else `~/.config/edc_pqr`.
- `keys/main_identity.key`: armored secret key, mode `0600`.
- `keys/main_identity.pub`: armored public key, mode `0644`.

## Behavior
- stdout: nothing but the armored public key. stderr: a short status line.
- If `keys/main_identity.key` already exists: refuse with exit code 1 and an error on stderr. Never overwrite.
- `-h` / `--help` and `-V` / `--version` work (clap built-ins).

## Acceptance Criteria
- [ ] `edc_pqr identity generate` and `edc_pqr g` both create the two files with the modes above.
- [ ] A second run refuses and leaves the existing files byte-for-byte unchanged.
- [ ] Integration tests run with `EDC_PQR_DIR` pointing at a temp dir (never the real config dir).
- [ ] The generated key matches the key profile (test inspects algorithms and key version).
- [ ] README usage section and CHANGELOG `[Unreleased]` line updated.
