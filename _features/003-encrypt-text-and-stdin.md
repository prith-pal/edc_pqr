---
id: "003"
type: feat
title: encrypt text and stdin to the default identity
status: todo
depends_on: ["002"]
size: M
pr:
---

# 003: encrypt text and stdin to the default identity

## Goal
Encrypt inline text or stdin to `main_identity`, with readable output on a terminal.

## CLI

```sh
edc_pqr encrypt -t 'Begun, the Clone War has.'   # -----BEGIN PGP MESSAGE----- ...
edc_pqr e -t 'Begun, the Clone War has.'         # same (word alias)
echo 'hi' | edc_pqr e > hi.pgp                    # stdin -> binary file
```

| Option | Value | Meaning |
|:--|:--|:--|
| `-t`, `--text` | `TEXT` | Plaintext given inline |
| (none) | | Read plaintext from stdin |

## Behavior
- Recipient: `keys/main_identity.pub` (hardcoded in this ticket; `-r` comes later).
- Output goes to stdout.
- Output format is automatic: ASCII armor when stdout is a TTY, binary otherwise.
- `-t` and stdin are mutually exclusive: if both are given, exit 1 with an error.
- Missing `main_identity`: exit 1 with a hint to run `edc_pqr identity generate`.

## Acceptance Criteria
- [ ] `edc_pqr e -t '...'` on a TTY prints an armored `PGP MESSAGE`.
- [ ] Piped output is binary and decrypts with the secret key via rPGP in a test.
- [ ] The message uses the ML-KEM-768 + X25519 subkey and SEIPD v2 (test inspects packets).
- [ ] Encrypting the same text twice gives different ciphertexts.
- [ ] README notes that `-t` puts plaintext in argv (visible in `ps` and shell history); use stdin for secrets.
- [ ] CHANGELOG `[Unreleased]` line updated.
