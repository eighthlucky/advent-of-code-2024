// Setup
console.log('---Day 3---');
const text = Deno.readTextFileSync(new URL('./input.txt', import.meta.url));

// Part 1 - Evaluate valid `mul()` commands and find the sum
{
  // Set this up to be referenced inside eval(), kek
  // deno-lint-ignore no-unused-vars
  const mul = (a: number, b: number) => a * b;

  const multiplyInstructionRegex = /mul\(\d{1,3},\d{1,3}\)/g;
  const result = text.matchAll(multiplyInstructionRegex)
    .map(([match]) => match)
    .map((command) => eval(command)) // Hack to run mul(...,...) command
    .reduce((acc, v) => acc + v, 0);
  console.log('sum of multiply commands:', result);
}

// Part 2 - Evaluate valid `mul()` commands and find the sum
// `do()` and `don't()` commands toggle `mul()` on and off
{
  let isEnabled = true;
  const handleDo = () => {
    isEnabled = true;
    return 0;
  };
  const handleDont = () => {
    isEnabled = false;
    return 0;
  };

  // Set this up to be referenced inside eval(), kek
  // deno-lint-ignore no-unused-vars
  const mul = (a: number, b: number) => isEnabled ? a * b : 0;

  const instructionRegex = /mul\(\d{1,3},\d{1,3}\)|do\(\)|don't\(\)/g;
  const result = text.matchAll(instructionRegex)
    .map(([match]) => match)
    .map((command) => {
      if (command.startsWith('do(')) return handleDo();
      else if (command.startsWith("don't(")) return handleDont();
      else return eval(command); // Hack to run mul(...,...) command
    })
    .reduce((acc, v) => acc + v, 0);
  console.log('sum of conditional multiply commands:', result);
}
