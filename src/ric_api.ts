declare var Deno: any;
const { core } = Deno;

type PositionLike = [number, number, number, number];

class Position {
    x: number;
    y: number;
    z: number;
    t: number;

    /**
     * An `Element`'s position.
     */
    constructor(
        x: number = 0,
        y: number = 0,
        z: number = 0,
        t: number = 0,
    ) {
        [this.x, this.y, this.z, this.t] = [x, y, z, t];
    }

    displace(...args: [Position] | PositionLike) {
        let other: PositionLike = args[0] instanceof Position ? args[0].toArray() : (args as PositionLike);
        this.x += other[0];
        this.y += other[1];
        this.z += other[2];
        this.t += other[3];
    }

    toArray(): PositionLike {
        return [this.x, this.y, this.z, this.t];
    }
}

type Argument = number | string | boolean | null;

type Variant = {
    name: string;
    arguments: Argument[];
};

type ElementKind = "tile" | "sign";

class Element {
    position: Position;
    name: string;
    kind: ElementKind;
    variants: Variant[];

    /**
     * A scene element.
     */
    constructor(
        name: string,
        kind: ElementKind,
        position: Position = new Position,
        variants: Variant[] = [],
    ) {
        [this.name, this.kind, this.position, this.variants] = [name, kind, position, variants];
    }

    getX(): number {
        return this.position.x;
    }

    getY(): number {
        return this.position.y;
    }

    getZ(): number {
        return this.position.z;
    }

    getT(): number {
        return this.position.t;
    }
}

/**
 * The definition of root of the Robot Is Chill API.
 */
const _RIC = {
    /**
     * A test function.
     * @returns A test message
     */
    test: (): string => "Hello! This is a test message from the RIC API.",
    /**
     * Runs a legacy macro, for backwards compatibility.
     * @param macro The legacy macro to run
     * @returns The macro output
     */
    legacyMacro: (macro: string): string => macro.replace(/abc/g, "def"), // You mentioned once that "macros are like find/replace" so I'm using this as an example
    /**
     * Calls a Rust function that appends text onto the given string.
     * @param s The string to append to
     * @returns The input string, with text appended
     */
    testRustString: async (s: string): Promise<string> => core.ops.op_test_rust_string(s), // Wrap for safety and to declare proper typing
    Element: Element,
    Position: Position,
};

declare global {
    /**
     * The root of the Robot Is Chill API.
     */
    var RIC: typeof _RIC;
}

globalThis.RIC = _RIC;

export { };
