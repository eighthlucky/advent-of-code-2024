// Setup
console.log('---Day 3---');

const text = Deno.readTextFileSync(new URL('./input.txt', import.meta.url));
const lines = text.split('\n');

// Part 1 - Find all occurrences of XMAS
{
  const SEARCH_STRING = 'XMAS';
  const xLocations = lines.entries()
    .flatMap(([y, line]) =>
      Iterator.from(line)
        .map((char, x) => char === SEARCH_STRING[0] ? [x, y] : undefined)
        .filter((location) => !!location)
    ).toArray();

  // Prep for traversal in 8 directions
  const directions = [-1, 0, 1]
    .flatMap((xDir, _, arr) =>
      arr.map((yDir) => [xDir, yDir])
        .filter(([x, y]) => x || y) // exclude [0, 0]
    );

  let validCount = 0;
  const STEPS = SEARCH_STRING.length - 1;
  for (const coordinates of xLocations) {
    for (const [xDir, yDir] of directions) {
      let [x, y] = coordinates;

      let isWrong = false;
      for (let step = 1; step <= STEPS; step++) {
        // Step forward
        x += xDir;
        y += yDir;
        const char = lines[y]?.[x];

        // Compare character with current position in search string
        if (!char || char !== SEARCH_STRING[step]) {
          isWrong = true;
          break;
        }
      }

      if (!isWrong) validCount++;
    }
  }

  console.log("'XMAS' count:", validCount);
}
