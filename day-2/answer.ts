// Setup
console.log('---Day 2---');

const text = Deno.readTextFileSync(`${import.meta.dirname}/input.txt`);
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
