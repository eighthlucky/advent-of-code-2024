// setup
console.log('---Day 11---');

const text = Deno.readTextFileSync(new URL('./input.txt', import.meta.url));
const initialStones = text
  .split(/\s/)
  .map((n) => Number.parseInt(n, 10));

// Part 1 - Iterate over stones 25 times
// 0 is replaced with 1
// Even digits are split into two stones
// Other stones are multiplied by 2024
{
  const values = initialStones.slice();
  const insert: [value: number, index: number][] = [];

  const ITERATIONS = 25;
  for (const _ of Array.from({ length: ITERATIONS })) {
    for (let i = 0; i < values.length; i++) {
      const value = values[i];

      // Case: 0 -> 1
      if (value === 0) {
        values[i] = 1;
        continue;
      }

      // Case: even digits -> split
      const valueAsString = value.toString(10);
      if (valueAsString.length % 2 === 0) {
        const digitsPerSide = valueAsString.length / 2;

        // Mark for insert later
        const right = Number.parseInt(
          valueAsString.slice(digitsPerSide),
          10,
        );
        insert.push([right, i + 1]);

        // Update current stone with the remaining value
        const left = valueAsString.slice(0, digitsPerSide);
        values[i] = Number.parseInt(left, 10);

        continue;
      }

      // Case: other -> multiply 2024
      values[i] *= 2024;
    }

    // insert split digits and clear array
    for (const [value, i] of insert) {
      values.splice(i, 0, value);
    }
    insert.length = 0;
  }

  console.log('total stones:', values.length);
}

// Part 2 - Iterate over stones 75 times
// Otherwise, same as part 1
{
  const ITERATIONS = 45;

  let values = initialStones.values();
  for (const _ of Array.from({ length: ITERATIONS })) {
    values = values.flatMap((v) => {
      // Case: 0 -> 1
      if (v === 0) return [1];

      // Case: even digits -> split
      // https://math.stackexchange.com/questions/469606/how-to-get-count-of-digits-of-a-number
      const numDigits = Math.floor(Math.log10(v)) + 1;
      if (numDigits % 2 === 0) {
        const digitsPerSide = numDigits / 2;
        const split = 10 ** digitsPerSide;

        const right = v % split;
        const left = (v - right) / split;

        return [left, right];
      }

      // Case: other -> multiply 2024
      return [v * 2024];
    });

    console.count('iteration');
  }

  let total = 0;
  values.forEach(() => total++);

  console.log('total stones:', total);
}
