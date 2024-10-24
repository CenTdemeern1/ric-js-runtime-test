declare function _assert(condition: boolean, message?: string): void;
declare global {
    /**
     * A function to assert that a condition holds true.
     * @param condition The condition to check.
     * @param message The message to display in the error message if the condition fails.
     */
    var assert: typeof _assert;
}
export {};
