use std::process::{Command, Stdio};

fn main() {
    println!("cargo::rerun-if-changed=tsconfig.json");
    println!("cargo::rerun-if-changed=src/**.ts");
    Command::new("deno")
        .args(["run", "-A", "npm:typescript/tsc"])
        .stdin(Stdio::inherit())
        .stdout(Stdio::inherit())
        .stderr(Stdio::inherit())
        .output()
        .unwrap();
}
