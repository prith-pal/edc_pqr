---
id: "004"
type: feat
title: decrypt text and stdin with the default identity
status: todo
depends_on: ["003"]
size: M
pr:
---

# 004: decrypt text and stdin with the default identity

## Goal
Decrypt inline armored text or stdin with `main_identity`, completing the round trip.

## CLI

```sh
edc_pqr decrypt -t "$(edc_pqr e -t 'Begun, the Clone War has.')"   # Begun, the Clone War has.
edc_pqr d -t "-----BEGIN PGP MESSAGE----- ..."                      # paste from a chat
echo 'hi' | edc_pqr e | edc_pqr d                                   # hi
```

| Option | Value | Meaning |
|:--|:--|:--|
| `-t`, `--text` | `ENCRYPTED_TEXT` | Encrypted text given inline (the `-----BEGIN PGP MESSAGE-----` block) |
| (none) | | Read ciphertext from stdin |

## Behavior
- Identity: `keys/main_identity.key` (hardcoded in this ticket; `-i` comes later).
- Input format is auto-detected: armored or binary.
- Plaintext goes to stdout. Errors go to stderr.
- `-t` and stdin are mutually exclusive: if both are given, exit 1.

## Exit Codes

| Code | Meaning |
|:--|:--|
| 0 | ok |
| 1 | usage / IO error |
| 2 | no matching identity (message not encrypted to `main_identity`) |
| 3 | authentication failure (tampered or truncated message) |

## Acceptance Criteria
- [ ] `d -t "$(e -t X)"` prints `X`, and `echo X | e | d` prints `X` (integration tests).
- [ ] Armored and binary inputs both decrypt.
- [ ] One flipped byte in the ciphertext exits 3 and prints no plaintext.
- [ ] A truncated message exits 3 and prints no plaintext.
- [ ] A message for a different key exits 2.
- [ ] The ticket-001 fixture message decrypts through the CLI when its key is placed as `main_identity`.
- [ ] README round-trip demo and CHANGELOG `[Unreleased]` line updated.
