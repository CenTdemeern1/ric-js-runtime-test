declare var Deno: any;
const { core } = Deno;

const isRewrite: boolean = false;

interface HasToString {
    toString(): string;
}

function genArgumentFormat(firstItem: string, itemList: HasToString[], separator: string) {
    const stringList = itemList.map(i => i.toString());
    stringList.unshift(firstItem);
    return stringList.join(separator);
}

type PositionLike = [number, number, number, number]
                    | [number, number, number]
                    | [number, number]
                    | [number]
                    | [];

type PositionArgument = [Position] | PositionLike;

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

    static fromArray(array: PositionLike): Position {
        return new Position(...array);
    }

    /**
     * Displace this position in-place.
     * @param args Either a Position or at most 4 position numbers
     */
    displace(...args: PositionArgument) {
        let other: PositionLike = args[0] instanceof Position ? args[0].toArray() : (args as PositionLike);
        this.x += other[0] ?? 0;
        this.y += other[1] ?? 0;
        this.z += other[2] ?? 0;
        this.t += other[3] ?? 0;
    }

    /**
     * Return a displaced copy of this position.
     * @param args Either a Position or at most 4 position numbers
     */
    toDisplaced(...args: PositionArgument): Position {
        let other: PositionLike = args[0] instanceof Position ? args[0].toArray() : (args as PositionLike);
        return new Position(
            this.x + (other[0] ?? 0),
            this.y + (other[1] ?? 0),
            this.z + (other[2] ?? 0),
            this.t + (other[3] ?? 0),
        );
    }

    copy(): Position {
        const { x, y, z, t } = this;
        return new Position(x, y, z, t);
    }

    toArray(): PositionLike {
        return [this.x, this.y, this.z, this.t];
    }

    toString(): string {
        return `Position { x: ${this.x}, y: ${this.y}, z: ${this.z}, t: ${this.t} }`
    }
}

type Argument = number | string | boolean | null;

interface VariantLike {
    name: string;
    args?: Argument[];
}

class Variant {
    name: string;
    args: Argument[];

    constructor(
        name: string,
        ...args: Argument[]
    ) {
        [this.name, this.args] = [name, args];
    }

    static fromObject(object: VariantLike): Variant {
        let { name, args } = object;
        return new Variant(name, ...(args ?? []));
    }

    /**
     * Shorthand to create a displace variant.
     * @param args Either a Position or at most 4 position numbers
     */
    static displace(...args: PositionArgument) {
        if (args[0] instanceof Position) {
            const { x, y, z, t } = args[0];
            return new Variant("displace", x, y, z, t);
        }
        return new Variant("displace", ...(args as PositionLike));
    }

    toString(): string {
        const args = this.args.map(i => `${i}`);
        return isRewrite ? genArgumentFormat(
            this.name,
            args,
            "/"
        ) : `${this.name}${args.join("/")}`;
    }
};

type ElementKind = "tile" | "text" | "glyph" | "node" | "sign";

function generateElementKindFunction(kind: ElementKind, alias?: string) {
    const f = (
        name: string,
        variants?: Variant[],
        position?: Position
    ): Element => new Element(
        name,
        kind,
        variants,
        position
    );
    Object.defineProperty(f, "name", {
        value: alias ?? kind,
    });
    return f;
}

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
        variants: Variant[] = [],
        position: Position = new Position,
    ) {
        [this.name, this.kind, this.position, this.variants] = [name, kind, position.copy(), variants];
    }

    static tile = generateElementKindFunction("tile");
    static sign = generateElementKindFunction("sign");
    static text = generateElementKindFunction("text");
    static rule = generateElementKindFunction("text", "rule");
    static glyph = generateElementKindFunction("glyph"); // ???
    static node = generateElementKindFunction("node"); // ???

    static escapeSignText(text: string): string {
        return text.replaceAll(/([& :;/\\<>$])/g, "\\$1");
    }

    makeSignTextString(): string {
        return `{${Element.escapeSignText(this.name)}}`;
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

    /**
     * Shorthand to add a displace variant to this Element.
     * @param args Either a Position or at most 4 position numbers
     */
    displace(...args: PositionArgument) {
        this.addVariant(Variant.displace(...args));
    }

    /**
     * Shorthand to displace this Element's position.
     * @param args Either a Position or at most 4 position numbers
     */
    displacePosition(...args: PositionArgument) {
        this.position.displace(...args);
    }

    addVariant(variant: Variant | VariantLike) {
        if (!(variant instanceof Variant))
            variant = Variant.fromObject(variant)
        this.variants.push(variant as Variant);
    }

    toString(): string {
        return genArgumentFormat(
            this.kind === "sign" ? this.makeSignTextString() : this.name,
            this.variants.map(i => i.toString()),
            ":"
        );
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
    testRustString: async (s: string): Promise<string> => core.ops.op_test_rust_string(s), // Wrap to declare proper typing
    /**
     * A fastcall example that prints something.
     * @param s The input string to print
     */
    print: (s: string) => core.ops.op_print_string_fast(s),
    Element: Element,
    Position: Position,
    Variant: Variant,
};

declare global {
    /**
     * The root of the Robot Is Chill API.
     */
    var RIC: typeof _RIC;
}

globalThis.RIC = _RIC;

export { };
