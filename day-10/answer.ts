// setup
console.log('---Day 10---');

const text = Deno.readTextFileSync(new URL('./input.txt', import.meta.url));

const grid = text
  .split('\n')
  .map((line) =>
    line.split('')
      .map((char) => Number.parseInt(char, 10))
  );

const trailHeads = grid
  .values()
  .flatMap(
    (row, y) =>
      row.entries()
        .filter(([, height]) => !height)
        .map(([x]) => [x, y] as const),
  )
  .toArray();

// Part 1 - Calculate score of trailheads
// Trailheads start at 0 and have a path to peaks of height 9
{
  let score = 0;
  for (const trailHead of trailHeads) {
    const stack = [trailHead];
    const peaksVisited = new Set<string>();

    while (stack.length) {
      const [x, y] = stack.pop() ?? [];
      if (
        typeof x === 'undefined' ||
        typeof y === 'undefined'
      ) throw new Error('missing coordinates');

      const height = grid[y][x];
      const key = `${x}_${y}`;
      if (height >= 9 && !peaksVisited.has(key)) {
        peaksVisited.add(key);
        score++;
        continue;
      }

      // Valid neighbours are in-bounds and are higher than current height by 1
      const neighbours = ([
        [x - 1, y],
        [x, y - 1],
        [x + 1, y],
        [x, y + 1],
      ] as const)
        .filter(([x2, y2]) => {
          const _height = grid[y2]?.[x2] ?? -1;
          return _height === height + 1;
        });

      stack.push(...neighbours);
    }
  }

  console.log('total score of trailheads:', score);
}
