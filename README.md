<div align="center">

# edc_pqr

**Post-quantum resistant encryption from the command line, with sane defaults.**

Part of `edc_`: everyday-carry CLIs. Small, sharp, independent tools.

[![CI](https://github.com/prith-pal/edc_pqr/actions/workflows/ci.yml/badge.svg)](https://github.com/prith-pal/edc_pqr/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-MIT%20OR%20Apache--2.0-6abf40.svg)](#license)
[![Rust](https://img.shields.io/badge/rust-1.85%2B-6abf40.svg?logo=rust)](https://www.rust-lang.org)
[![Agentic](https://img.shields.io/badge/built%20with-AI%20agents-6abf40.svg)](AGENTS.md)
<!-- Enable after the first crates.io publish:
[![crates.io](https://img.shields.io/crates/v/edc_pqr.svg)](https://crates.io/crates/edc_pqr)
[![docs.rs](https://img.shields.io/docsrs/edc_pqr)](https://docs.rs/edc_pqr)
[![Downloads](https://img.shields.io/crates/d/edc_pqr.svg)](https://crates.io/crates/edc_pqr)
-->

</div>

> [!NOTE]
> Early development. The CLI surface is not stable yet.

## Install

```sh
cargo install --git https://github.com/prith-pal/edc_pqr
```

## Development

```sh
cargo fmt --all --check
cargo clippy --all-targets -- -D warnings
cargo test
```

This repo is built with AI coding agents. See [AGENTS.md](AGENTS.md) for the conventions they follow.

## License

Licensed under either of [Apache License 2.0](LICENSE-APACHE) or [MIT](LICENSE-MIT), at your option.
