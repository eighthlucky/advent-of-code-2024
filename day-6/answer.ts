// Setup
console.log('---Day 6---');

const text = Deno.readTextFileSync(new URL('./input.txt', import.meta.url));
const grid = text.split('\n');

const START = '^';
const OBSTACLE = '#';

// Part 1 - traverse grid and count no. of unique positions
{
  // Find starting position
  let [y, startLine] = grid
    .entries()
    .find(([_, line]) => line.includes(START)) ?? [];
  let x = startLine?.indexOf(START);
  if (
    x === undefined ||
    y === undefined
  ) throw new Error("can't find start");

  // Face upwards
  const RIGHT_ANGLE = Math.PI / 2; // radians
  let direction = 0; // radians

  const uniquePositions = new Set<string>([
    `${x}_${y}`, // starting position
  ]);
  while (true) {
    // Work out next position
    // See https://en.wikipedia.org/wiki/Polar_coordinate_system
    const dy = -Math.round(Math.cos(direction));
    const dx = Math.round(Math.sin(direction));

    const y2 = y + dy;
    const x2 = x + dx;

    // Case: exit grid -> finish
    // Case: obstacle -> turn right
    const cell = grid[y2]?.[x2];
    if (cell === undefined) break;
    if (cell === OBSTACLE) {
      direction += RIGHT_ANGLE;
      continue;
    }

    // Otherwise, continue moving and track position
    y = y2;
    x = x2;
    uniquePositions.add(`${x}_${y}`);
  }

  console.log('unique positions traversed', uniquePositions.size);
}
