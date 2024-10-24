type PositionLike = [number, number, number, number];
declare class Position {
    x: number;
    y: number;
    z: number;
    t: number;
    /**
     * An `Element`'s position.
     */
    constructor(x?: number, y?: number, z?: number, t?: number);
    displace(...args: [Position] | PositionLike): void;
    toArray(): PositionLike;
}
type Argument = number | string | boolean | null;
type Variant = {
    name: string;
    arguments: Argument[];
};
type ElementKind = "tile" | "sign";
declare class Element {
    position: Position;
    name: string;
    kind: ElementKind;
    variants: Variant[];
    /**
     * A scene element.
     */
    constructor(name: string, kind: ElementKind, position?: Position, variants?: Variant[]);
    getX(): number;
    getY(): number;
    getZ(): number;
    getT(): number;
}
/**
 * The definition of root of the Robot Is Chill API.
 */
declare const _RIC: {
    /**
     * A test function.
     * @returns A test message
     */
    test: () => string;
    /**
     * Runs a legacy macro, for backwards compatibility.
     * @param macro The legacy macro to run
     * @returns The macro output
     */
    legacyMacro: (macro: string) => string;
    /**
     * Calls a Rust function that appends text onto the given string.
     * @param s The string to append to
     * @returns The input string, with text appended
     */
    testRustString: (s: string) => Promise<string>;
    Element: typeof Element;
    Position: typeof Position;
};
declare global {
    /**
     * The root of the Robot Is Chill API.
     */
    var RIC: typeof _RIC;
}
export {};
