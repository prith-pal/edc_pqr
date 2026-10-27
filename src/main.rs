use clap::Parser;

/// Post-quantum resistant encryption, decryption and key generation from the command line.
#[derive(Parser)]
#[command(version, about)]
struct Cli {}

fn main() {
    let _cli = Cli::parse();
}
