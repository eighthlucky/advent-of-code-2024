// setup
console.log('---Day 9---');

const text = Deno.readTextFileSync(new URL('./input.txt', import.meta.url));

const SPACE = Symbol.for('.');

// Part 1 - compact files by swapping file ID blocks with free space
{
  const intermediate = text
    .split('')
    .flatMap((_size, i) => {
      const isFile = i % 2 === 0;
      const size = Number.parseInt(_size, 10);
      if (!isFile) {
        return Array.from(
          { length: size },
          () => SPACE,
        );
      }

      // Every 2nd block is free space
      // So filename is i / 2
      const _filename = Math.floor(i / 2)
        .toString(10);

      return Array.from(
        { length: size },
        () => Symbol.for(_filename),
      );
    });

  // Swap blocks of file ID with free space blocks
  // Crawl through file IDs right-to-left,
  // and crawl through free space blocks left-to-right
  let freeSpaceIndex = 0;
  for (let i = intermediate.length - 1; i >= 0; i--) {
    if (intermediate[i] === SPACE) continue;

    for (let j = freeSpaceIndex; j <= i; j++) {
      if (intermediate[j] !== SPACE) continue;

      freeSpaceIndex = j;
      break;
    }
    if (freeSpaceIndex >= i) break;

    [intermediate[freeSpaceIndex], intermediate[i]] = [
      intermediate[i],
      intermediate[freeSpaceIndex],
    ];
  }

  // Checksum is block position * file size
  const checksum = intermediate.reduce((acc, char, i) => {
    if (char === SPACE) return acc;

    const id = Symbol.keyFor(char);
    if (id === undefined) throw new Error('unexpected character');

    return acc + Number.parseInt(id, 10) * i;
  }, 0);

  console.log('checksum:', checksum);
}

// Part 2 - compact files by swapping file ID blocks with free space
// Same as part 1, but swap consecutive blocks
{
  const intermediate = text
    .split('')
    .map((_size, i): [string | typeof SPACE, number] | undefined => {
      const size = Number.parseInt(_size, 10);
      if (!size) return undefined;

      const isFile = i % 2 === 0;
      if (!isFile) {
        return [SPACE, size];
      }

      // Every 2nd block is free space
      // So filename is i / 2
      const filename = Math.floor(i / 2)
        .toString(10);

      return [filename, size];
    })
    .filter((block) => !!block);

  // Swap blocks of file ID with free space blocks
  // Crawl through file IDs right-to-left,
  // and crawl through free space blocks left-to-right
  for (let i = intermediate.length - 1; i >= 0; i--) {
    if (intermediate[i][0] === SPACE) continue;

    const freeSpaceIndex = intermediate
      .findIndex(([char, size], j) =>
        // Only check for free space before current block
        j < i &&
        size >= intermediate[i][1] &&
        char === SPACE
      );
    if (freeSpaceIndex === -1) continue;

    // If there's a gap, we want to 'split' the space and only
    // swap as much as we need
    const gap = intermediate[freeSpaceIndex][1] - intermediate[i][1];
    if (gap) {
      intermediate[freeSpaceIndex][1] = intermediate[freeSpaceIndex][1] - gap;
      intermediate.splice(freeSpaceIndex + 1, 0, [SPACE, gap]);

      // Increment i to account for added space block
      i++;
    }

    [intermediate[freeSpaceIndex], intermediate[i]] = [
      intermediate[i],
      intermediate[freeSpaceIndex],
    ];
  }

  // Checksum is block position * file size
  const checksum = intermediate
    // Expand/flatten blocks so we can do our checksum
    .values()
    .flatMap(([char, size]) => Array.from({ length: size }, () => char))
    .reduce((acc, char, i) => {
      if (char === SPACE) return acc;

      return acc + Number.parseInt(char, 10) * i;
    }, 0);

  console.log('checksum:', checksum);
}
