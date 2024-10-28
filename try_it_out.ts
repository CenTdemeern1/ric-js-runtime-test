import type { } from "./src/runtime";
import type { } from "./src/ric_api";

const position = new RIC.Position(1, 2, 3, 4); // =>
const element = new RIC.Element("baba", "tile", [], position);
//    ^?
const {x, y, z, t} = element.position; // =>
console.log(`X position: ${x}`);
console.log(`Y position: ${y}`);
console.log(`Z position: ${z}`);
console.log(`T position: ${t}`);

console.log(
    RIC.Element.tile(
        "baba",
        [ RIC.Variant.fisheye(5) ],
        position
    ).toString()
);

console.log(
    RIC.Element.sign("Cool sign").toString()
)
