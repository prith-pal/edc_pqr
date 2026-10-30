---
id: "001"
type: test
title: rPGP post-quantum spike with RFC 9980 fixtures
status: todo
depends_on: []
size: S
pr:
---

# 001: rPGP post-quantum spike with RFC 9980 fixtures

## Goal
Prove that the `pgp` crate (rPGP) can generate a post-quantum OpenPGP key and round-trip a message,
and lock that behavior in with tests before any CLI work starts.

## Key Profile (fixed for the whole tool)

| Part | Algorithm |
|:--|:--|
| Key version | v6 (RFC 9580) |
| Primary key | ML-DSA-65 + Ed25519 |
| Encryption subkey | ML-KEM-768 + X25519 |
| Message | SEIPD v2 (AEAD) |

## Scope
- Add `pgp` as a dependency with whatever feature flag enables RFC 9980 PQC.
- Integration test: generate a key with the profile above, encrypt a short message to it, decrypt it, compare.
- Fixtures: commit at least one public key, secret key and message produced by an independent RFC 9980
  implementation (the RFC's own test vectors if it has them, otherwise Sequoia, GopenPGP or OpenPGP.js)
  under `tests/fixtures/rfc9980/`. Test that rPGP decrypts the fixture message with the fixture secret key.
- Record findings in `AGENTS.md` under "Security Rules": crate version, feature flag, its production status,
  fixture source.

## Acceptance Criteria
- [ ] `cargo test` runs the generate -> encrypt -> decrypt round trip and passes.
- [ ] `cargo test` decrypts the independent fixture and passes.
- [ ] A tampered fixture (one flipped byte in the ciphertext) fails to decrypt.
- [ ] `AGENTS.md` records the crate version, feature flag, production status and fixture source.
- [ ] No CLI changes in this ticket.

## Notes
- If the PQC feature is marked not-for-production, record it plainly and continue: the ticket's job is to measure.
- Record the armored public key size (expected to be several KB) in the PR description.
