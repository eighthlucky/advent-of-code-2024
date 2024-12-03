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

  for (const report of reports) {
    let modeGradient = 0;
    report.reduce((a, b) => {
      modeGradient += Math.sign(b - a);
      return b;
    });
    modeGradient = Math.sign(modeGradient);

    const possibleSequences = [
      // we don't need the full array, theoretically, as we can tolerate a single
      // error
      Iterator.from(report),

      // Possible sequences with single value removed
      ...report.map((_, i) => Iterator.from(report).filter((_, j) => j !== i)),
    ];

    let hasValid = false;
    for (const sequence of possibleSequences) {
      let prevLevel = undefined;
      let isErr = false;

      for (const level of sequence) {
        // Skip first value
        if (prevLevel === undefined) {
          prevLevel = level;
          continue;
        }

        const diff = level - prevLevel;
        const gradient = Math.sign(diff);
        const dist = Math.abs(diff);

        // Valid reports must be in ASC or DESC order, and the difference
        // between levels must be between 1 and 3 (incl.)
        const isValid = gradient === modeGradient && dist >= 1 && dist <= 3;
        if (!isValid) {
          isErr = true;
          break;
        }

        prevLevel = level;
        continue;
      }

      if (isErr) continue;

      // If we're at this point, we've looped through a whole sequence without
      // any issues
      hasValid = true;
      break;
    }

    if (hasValid) validCount++;
  }

  console.log('valid reports with tolerance 1:', validCount);
}
