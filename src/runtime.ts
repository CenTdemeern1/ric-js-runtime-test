declare var Deno: any;
const { core } = Deno;

function argsToMessage(...args) {
    return args.map((arg) => JSON.stringify(arg)).join(" ");
}

// @ts-ignore
globalThis.console = {
    log: (...args) => {
        core.print(`[out]: ${argsToMessage(...args)}\n`, false);
    },
    error: (...args) => {
        core.print(`[err]: ${argsToMessage(...args)}\n`, true);
    },
};

function _assert(condition: boolean, message?: string) {
    if (!condition) {
        throw new Error(`Assertion failed: ${message ?? "No message given."}`);
    }
}

globalThis.assert = _assert;

declare global {
    /**
     * A function to assert that a condition holds true.
     * @param condition The condition to check.
     * @param message The message to display in the error message if the condition fails.
     */
    var assert: typeof _assert;
}

export {};

// IMPORTANT: These stop the user from calling random Deno.core APIs and messing with the filesystem and stuff
delete Deno.core;
delete globalThis.Deno;
