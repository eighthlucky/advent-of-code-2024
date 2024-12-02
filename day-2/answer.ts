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

// Part 2 - Count valid reports, tolerating a single error
{
  let validCount = 0;

  for (const _report of reports) {
    const errorIndexes = new Set<number>();
    const reversedErrorIndexes = new Set<number>();

    for (const report of [_report, _report.toReversed()]) {
      let [prevLevel, ...remaining] = report;
      const gradient = Math.sign(remaining[0] - prevLevel);

      let prevIndex = 0;
      for (const level of remaining) {
        const index = ++prevIndex;

        const diff = level - prevLevel;
        const absoluteDiff = Math.abs(diff);
        const _gradient = Math.sign(diff);

        // Valid reports must be in ASC or DESC order, and the difference
        // between levels must be between 1 and 3 (incl.)
        const isInvalid = _gradient !== gradient ||
          absoluteDiff < 1 ||
          absoluteDiff > 3;

        if (isInvalid) {
          const isReversed = report !== _report;
          const _errorIndexes = isReversed
            ? reversedErrorIndexes
            : errorIndexes;
          _errorIndexes.add(
            isReversed ? (report.length - 1) - index : index,
          );
        } else {
          prevLevel = level;
        }
      }
    }

    const commonErrorIndexes = errorIndexes.intersection(reversedErrorIndexes);
    const isSafe = !errorIndexes.union(commonErrorIndexes).size ||
      errorIndexes.intersection(reversedErrorIndexes).size === 1;

    if (isSafe) validCount++;
  }

  console.log('valid reports with tolerance 1:', validCount);
}
