// Setup
console.log('---Day 6---');

const text = Deno.readTextFileSync(new URL('./input.txt', import.meta.url));
const grid = text.split('\n');

const MAX_X = grid[0].length - 1;
const MAX_Y = grid.length - 1;

// Antennas may be represented by a alphanumerical char
// Each char denotes a different frequency
const ANTENNA_REGEX = /\w/g;

const coordinatesByFrequency = new Map<string, [x: number, y: number][]>();
grid
  .forEach((line, y) => {
    line.matchAll(ANTENNA_REGEX)
      .forEach((match) => {
        const [char] = match;
        const { index: x } = match;

        const indexSet = coordinatesByFrequency.get(char) ??
          [];
        indexSet.push([x, y]);

        coordinatesByFrequency.set(
          char,
          indexSet,
        );
      });
  });

// Part 1 - Find antinodes for each antenna pair
// Distance from one antinode to 1st antenna is half the distance to the
// 2nd antenna, along a straight line
{
  const uniquePositions = new Set<string>();
  for (const coordinates of coordinatesByFrequency.values()) {
    // Find combinations of antenna pairs
    const pairs = coordinates.values()
      .flatMap((a, i) =>
        coordinates.values()
          .drop(i + 1)
          .map((b) =>
            [a, b]
              // Sort by x ASC, then by y ASC
              .sort(([x1, y1], [x2, y2]) => x1 - x2 || y1 - y2)
          )
      );

    // For each antenna pair, find the two antinodes
    // The antinodes should be placed outside an antenna pair,
    // evenly spaced along a line
    const antinodes = pairs
      .flatMap(([[x1, y1], [x2, y2]]) => {
        const diffX = x2 - x1;
        const diffY = y2 - y1;

        // Vertical line
        if (!diffX) {
          return [
            [x1, y1 - diffY],
            [x2, y2 + diffY],
          ];
        }

        // Linear gradient: y = mx + c
        const m = diffY / diffX;
        const c = y2 - (m * x2);

        const xNode1 = x1 - diffX;
        const xNode2 = x2 + diffX;

        const [yNode1, yNode2] = [xNode1, xNode2]
          .map((x) => {
            const y = m * x + c;

            // Round due to floating-point error
            return Math.round(y);
          });
        return [
          [xNode1, yNode1],
          [xNode2, yNode2],
        ];
      })
      // Check each position is within bounds of grid
      .filter(([x, y]) => x >= 0 && y >= 0 && x <= MAX_X && y <= MAX_Y);

    antinodes.forEach(([x, y]) => uniquePositions.add(`${x}_${y}`));
  }

  console.log('unique antinode positions:', uniquePositions.size);
}

// Part 2 - Find antinodes for each antenna pair
// Similar to part 1, but no. of antinodes is not capped at 2
{
  const uniquePositions = new Set<string>();
  for (const coordinates of coordinatesByFrequency.values()) {
    // Find combinations of antenna pairs
    const pairs = coordinates.values()
      .flatMap((a, i) =>
        coordinates.values()
          .drop(i + 1)
          .map((b) =>
            [a, b]
              // Sort by x ASC, then by y ASC
              .sort(([x1, y1], [x2, y2]) => x1 - x2 || y1 - y2)
          )
      );

    // For each antenna pair, find all antinodes
    // The antinodes should be placed outside an antenna pair,
    // evenly spaced along a line
    const antinodes = pairs
      .flatMap(([[x1, y1], [x2, y2]]) => {
        const diffX = x2 - x1;
        const diffY = y2 - y1;

        // Vertical line
        if (!diffX) {
          const offset = y1 % diffY;
          const maxAntinodes = Math.ceil(MAX_Y + 1 / diffY);

          return Array.from(
            { length: maxAntinodes },
            (_, i) => [x1, i * diffY + offset],
          );
        }

        // Linear gradient: y = mx + c
        const m = diffY / diffX;
        const c = y2 - (m * x2);

        const offset = x1 % diffX;
        const maxAntinodes = Math.ceil(MAX_X + 1 / diffX);

        return Array.from(
          { length: maxAntinodes },
          (_, i) => {
            const x = i * diffX + offset;
            const y = m * x + c;

            // Round due to floating-point error
            return [x, Math.round(y)];
          },
        );
      })
      // Check each position is within bounds of grid
      .filter(([x, y]) => x >= 0 && y >= 0 && x <= MAX_X && y <= MAX_Y);

    antinodes.forEach(([x, y]) => uniquePositions.add(`${x}_${y}`));
  }

  console.log(
    'unique antinode positions incl. resonant harmonics:',
    uniquePositions.size,
  );
}
