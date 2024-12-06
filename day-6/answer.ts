// Setup
console.log('---Day 6---');

const text = Deno.readTextFileSync(new URL('./input.txt', import.meta.url));
// const text = `....#.....
// .........#
// ..........
// ..#.......
// .......#..
// ..........
// .#..^.....
// ........#.
// #.........
// ......#...`;
const grid = text.split('\n');

const START = '^';
const OBSTACLE = '#';
const RIGHT_ANGLE = Math.PI / 2; // radians

const getStartPosition = () => {
  let [y, startLine] = grid
    .entries()
    .find(([_, line]) => line.includes(START)) ?? [];
  let x = startLine?.indexOf(START);
  if (
    x === undefined ||
    y === undefined
  ) throw new Error("can't find start");
  return [x, y];
};

// Part 1 - traverse grid and count no. of unique positions
{
  // Find starting position
  let [x, y] = getStartPosition();

  // Face upwards
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

// Part 2 - find cycle after placing an obstacle
{
  // Traverse grid to find path
  const path: [number, number, number][] = [];
  {
    // Find starting position
    let [x, y] = getStartPosition();

    let direction = 0; // radians, facing upwards
    const uniquePositions = new Set<string>();
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

      // Otherwise, track position, direction, and continue moving
      y = y2;
      x = x2;

      const checkUnique =
        uniquePositions.size !== uniquePositions.add(`${x}_${y}`).size;
      if (checkUnique) path.push([x, y, direction]);
    }
  }

  // For each position in the path, place an obstacle and simulate
  // traversal
  {
    const start = path.at(0);
    if (!start) throw new Error('missing path');

    const uniquePositions = new Set<string>();
    while (path.length) {
      let [x, y, direction] = start;

      const placedObstacle = path.shift();
      if (!placedObstacle) throw new Error('missing next step');

      const turnPositions = new Set<string>();
      while (true) {
        // Work out next position
        // See https://en.wikipedia.org/wiki/Polar_coordinate_system
        const dy = -Math.round(Math.cos(direction));
        const dx = Math.round(Math.sin(direction));

        const y2 = y + dy;
        const x2 = x + dx;

        // Case: cycle detected -> break
        const key = `${x}_${y}_${x2}_${y2}`;
        if (turnPositions.has(key)) {
          uniquePositions.add(`${placedObstacle[0]}_${placedObstacle[1]}`);
          break;
        }

        // Case: exit grid -> finish
        const cell = grid[y2]?.[x2];
        if (cell === undefined) break;

        // Case: obstacle -> turn right
        const isPlacedObstacle = x2 === placedObstacle[0] &&
          y2 === placedObstacle[1];
        if (isPlacedObstacle || cell === OBSTACLE) {
          turnPositions.add(`${x}_${y}_${x2}_${y2}`);
          direction += RIGHT_ANGLE;
          continue;
        }

        // Otherwise, continue moving
        y = y2;
        x = x2;
      }
    }

    console.log(
      'obstacle positions that will create a cycle:',
      uniquePositions.size,
    );
  }
}
