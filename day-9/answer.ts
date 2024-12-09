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
