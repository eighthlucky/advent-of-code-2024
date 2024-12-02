// Setup
console.log('---Day 2---');

const text = Deno.readTextFileSync(`${import.meta.dirname}/input.txt`);
// const text = `7 6 4 2 1
// 1 2 7 8 9
// 9 7 6 2 1
// 1 3 2 4 5
// 8 6 4 4 1
// 1 3 6 7 9`;
const reports = text.split('\n')
  .map((line) =>
    line
      .split(/\s+/)
      .map((n) => parseInt(n, 10))
  );

// Part 1 - Count valid reports
{
  let validCount = 0;

  for (const report of reports) {
    let [prevLevel, ...remaining] = report;
    const gradient = Math.sign(remaining[0] - prevLevel);
    if (!gradient) continue;

    let isInvalid = false;
    for (const level of remaining) {
      const diff = level - prevLevel;
      const absoluteDiff = Math.abs(diff);
      const _gradient = Math.sign(diff);

      // Valid reports must be in ASC or DESC order, and the difference
      // between levels must be between 1 and 3 (incl.)
      isInvalid = _gradient !== gradient ||
        absoluteDiff < 1 ||
        absoluteDiff > 3;

      prevLevel = level;
      if (isInvalid) break;
    }

    if (!isInvalid) validCount++;
  }

  console.log('valid reports:', validCount);
}

// Part 2 - Count valid reports, tolerating a single error
{
  let validCount = 0;
  const getCost = (a: number | undefined, b: number | undefined, c: number) => {
    if (b === undefined) return 0;
    const diff = c - b;
    if (!diff) return 1;

    const dist = Math.abs(diff);
    if (dist < 1 || dist > 3) return 1;
    if (a !== undefined && Math.sign(diff) !== Math.sign(b - a)) return 1;
  };

  for (const report of reports) {
    const queue = [[-1, 0]];
    const path = [];

    while (queue.length) {
      const [prev, index] = queue.pop() ?? [];
      if (index >= report.length) break;

      const cost = getCost(
        report[index - 2],
        report[prev],
        report[index],
      );

      const next = index + 1;
      if (cost) {
        queue.push([prev, next]);
        continue;
      }

      queue.push([index, next]);
      if (index >= 0) path.push(report[index]);
    }

    const isValid = path.length >= report.length - 1;
    if (isValid) validCount++;
  }

  console.log('valid reports with tolerance 1:', validCount);
}
