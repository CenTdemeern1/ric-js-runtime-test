use std::{env::args, rc::Rc};

use deno_core::error::AnyError;

mod ric_api;

async fn run_js(file_path: &str) -> Result<(), AnyError> {
    let main_module = deno_core::resolve_path(file_path, &std::env::current_dir()?)?;
    let mut js_runtime = deno_core::JsRuntime::new(deno_core::RuntimeOptions {
        module_loader: Some(Rc::new(deno_core::FsModuleLoader)),
        extensions: vec![
            ric_api::ric_api::init_ops_and_esm(),
        ],
        ..Default::default()
    });
    let internal_mod_id = js_runtime
        .load_side_es_module_from_code(
            &deno_core::ModuleSpecifier::parse("ric:runtime.js")?,
            include_str!("./runtime.js"),
        )
        .await?;
    let internal_mod_result = js_runtime.mod_evaluate(internal_mod_id);

    let mod_id = js_runtime.load_main_es_module(&main_module).await?;
    let result = js_runtime.mod_evaluate(mod_id);
    js_runtime.run_event_loop(Default::default()).await?;
    internal_mod_result.await?;
    result.await
}

#[tokio::main]
async fn main() {
    let file = args().skip(1).next().expect("Please specify a file to run");
    if let Err(error) = run_js(&file).await {
        eprintln!("Error: {}", error);
    }
}
