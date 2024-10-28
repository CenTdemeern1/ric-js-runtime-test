# Robot Is Chill JavaScript runtime
This is the repository for the upcoming JavaScript runtime for Robot Is Chill, based on [deno_core](https://github.com/denoland/deno_core).

How to try this out
---
### In your web browser:
1. [Open this repository in Gitpod.](https://gitpod.io/#https://github.com/ROBOT-IS-CHILL/ric-js-runtime) This repository has a Gitpod config so everything will be set up for you automatically.
2. Open `test.js` and you're ready to go!
### Locally:
1. [Install Deno](https://docs.deno.com/runtime/#install-deno).
2. Install Cargo + Rust via [Rustup](https://rustup.rs/).
3. Clone this repository via Git.
4. Run `deno install` in this repository's root directory
5. Open `test.js` in your editor of choice.
6. Use something like `cargo run -- test.js` to compile the runtime and use it to run `test.js`.

VSCode Troubleshooting
---
- TypeScript types/autocomplete aren't working!
  - VSCode is kind of stupid and it doesn't seem to use the `typeRoots` from the `tsconfig.json`.
  - To deal with this, just open `tstypes/ric_api.d.ts` and `tstypes/runtime.d.ts` in new tabs and pin them. As long as they're open, VSCode will recognize the types.
- Twoslash comments (`// ^?`, `// =>`) aren't working!
  - [Install this extension.](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-twoslash-queries)
  - They're mainly a TS playground feature, so support for them in VSCode requires an extension.
