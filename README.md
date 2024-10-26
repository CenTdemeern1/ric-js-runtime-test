# Robot Is Chill JavaScript runtime test

How to try this out
---
### In your web browser:
1. [Open this repository in Gitpod.](https://gitpod.io/#https://github.com/CenTdemeern1/ric-js-runtime-test) This repository has a Gitpod config so everything will be set up for you automatically.
2. Open `test.js` and you're ready to go!
### Locally:
1. [Install Deno](https://docs.deno.com/runtime/#install-deno).
2. Install Cargo + Rust via [Rustup](https://rustup.rs/).
3. Clone this repository via Git.
4. Open `test.js` in your editor of choice.
5. Use something like `cargo run -- test.js` to compile the runtime and use it to run `test.js`.

VSCode Troubleshooting
---
- TypeScript types/autocomplete aren't working!
  - VSCode is kind of stupid and it doesn't seem to use the `typeRoots` from the `tsconfig.json`.
  - To deal with this, just open `tstypes/ric_api.d.ts` and `tstypes/runtime.d.ts` in new tabs and pin them. As long as they're open, VSCode will recognize the types.
- Twoslash comments (`// ^?`, `// =>`) aren't working!
  - [Install this extension.](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-twoslash-queries)
  - They're mainly a TS playground feature, so support for them in VSCode requires an extension.
