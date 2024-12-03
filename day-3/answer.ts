// Setup
console.log('---Day 3---');
const text = Deno.readTextFileSync(new URL('./input.txt', import.meta.url));

// Part 1 - Evaluate valid `mul()` commands and find the sum
{
  const multiplyInstructionRegex = /mul\(\d{1,3},\d{1,3}\)/g;

  // Set this up to be referenced inside eval(), kek
  // deno-lint-ignore no-unused-vars
  const mul = (a: number, b: number) => a * b;

  const result = text.matchAll(multiplyInstructionRegex)
    .map(([match]) => match)
    .map((command) => eval(command)) // Hack to run mul(...,...) command
    .reduce((acc, v) => acc + v, 0);
  console.log('sum of multiply commands:', result);
}
