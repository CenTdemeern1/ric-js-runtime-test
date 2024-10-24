// assert(Deno === undefined);
// assert(Deno.core === undefined);
// assert(Deno.core.print === undefined);
var failed = true;
try {
    Deno.core.print("Test!")
    failed = false;
} catch {}
assert(failed, "Deno.core.print should not be usable.")
delete globalThis.failed;

console.log("Test2!")
console.error("Test3!")
const rustString = await RIC.testRustString("JavaScript String...");
//    ^?
console.log(RIC.test(), RIC.legacyMacro("abc1234abc754212"), rustString);

const position = new RIC.Position(1, 2, 3, 4); // =>
const element = new RIC.Element("baba", "tile", position);
//    ^?
const {x, y, z, t} = element.position; // =>
console.log(`X position: ${x}`);
console.log(`Y position: ${y}`);
console.log(`Z position: ${z}`);
console.log(`T position: ${t}`);

assert(element.position === position);
assert(element.position.toArray().every((value, index) => value === [x, y, z, t][index]));
assert(element.position.x === x);
assert(element.getY() === y);

console.log((await import("./test2.js")).default);
