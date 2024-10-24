use deno_core::{extension, op2};

extension!(
    ric_api,
    ops = [
        op_test_rust_string,
        op_print_string_fast,
    ],
    esm_entry_point = "ext:ric_api/ric_api.js",
    esm = [dir "src", "ric_api.js"],
);

#[op2(async)]
#[string]
async fn op_test_rust_string(#[string] mut input: String) -> String {
    input.push_str(" this was pushed on from Rust!");
    input
}

#[op2(fast)]
// Fastcall example.
fn op_print_string_fast(#[string] input: String) {
    println!("[rust]: {}", input);
}
