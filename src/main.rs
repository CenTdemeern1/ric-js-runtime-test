use std::{env::args, rc::Rc, sync::OnceLock};

use deno_core::{error::AnyError, v8::{IsolateHandle, V8::set_flags_from_string}};
use tokio::task::AbortHandle;

mod ric_api;

static ISOLATE: OnceLock<IsolateHandle> = OnceLock::new();

async fn run_js(file_path: &str) -> Result<(), AnyError> {
    set_flags_from_string("--noexpose-wasm --single-threaded --max-old-space-size=2"); // 2 is very low. A more reasonable value is usually in the thousands.
    let main_module = deno_core::resolve_path(file_path, &std::env::current_dir()?)?;
    let mut js_runtime = deno_core::JsRuntime::new(deno_core::RuntimeOptions {
        module_loader: Some(Rc::new(deno_core::FsModuleLoader)),
        extensions: vec![
            ric_api::ric_api::init_ops_and_esm(),
        ],
        ..Default::default()
    });
    let isolate = js_runtime.v8_isolate();
    ISOLATE.set(isolate.thread_safe_handle()).unwrap();
    extern "C" fn oom_handler(location: *const i8, details: &deno_core::v8::OomDetails) {
        println!("V8 is out of memory!");
        println!("Terminating execution");
        ISOLATE.get().unwrap().terminate_execution();
        println!("Execution terminated");
        std::process::abort()
    }
    isolate.set_oom_error_handler(oom_handler);
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
    let localset = tokio::task::LocalSet::new();
    let handle = localset.spawn_local(async move {
        if let Err(error) = run_js(&file).await {
            eprintln!("Error: {}", error);
        }
    });
    localset.await;
    match handle.await {
        Ok(()) => println!("Cool! Everything went well"),
        Err(err) => println!("Oh no! {err}"),
    }
}
