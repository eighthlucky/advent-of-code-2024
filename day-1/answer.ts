// Setup
const text = Deno.readTextFileSync(`${import.meta.dirname}/input.txt`);
const lists = text.split('\n')
  .flatMap((line) =>
    line
      .split(/\s+/)
      .map((n) => parseInt(n, 10))
  );

const listA = Iterator.from(lists)
  .filter((_, i) => i % 2 === 0) // 1st column
  .toArray()
  .sort();
const listB = Iterator.from(lists)
  .filter((_, i) => i % 2 !== 0) // 2nd column
  .toArray()
  .sort();

if (listA.length !== listB.length) {
  throw new Error('unequal list length');
}

// Part 1 - sum of distances between list values
const distances = listA.map((a, i) => Math.abs(a - listB[i]));
console.log('total distance:', distances.reduce((acc, v) => acc + v, 0));

// Part 2 - similarity score
// List A * no. of appearances in list B
const appearancesByNumber = Object.groupBy(listB, (v) => v);
const scores = listA.map((v) => {
  const frequency = appearancesByNumber[v]?.length ?? 0;
  return v * frequency;
});
console.log('total similarity score:', scores.reduce((acc, v) => acc + v, 0));
