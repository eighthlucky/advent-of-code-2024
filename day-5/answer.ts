// Setup
console.log('---Day 5---');

const text = Deno.readTextFileSync(new URL('./input.txt', import.meta.url));
const lines = text.split(/\n+/);

// Part 1 - Print middle number of correctly ordered lines
{
  const rules = lines.values()
    .filter((line) => line[2] === '|')
    .map((rule) => rule.split('|'));

  // Group rules by start
  const lookup = new Map(
    Object.entries(
      Object.groupBy(
        rules,
        (rule) => rule[0],
      ),
    ).map(([k, rules]) => [
      k,
      new Set(rules?.map((rule) => rule[1]) ?? []),
    ]),
  );

  const sum = lines.values()
    // Page numbers are delimited by ','
    .filter((line) => line[2] === ',')
    .map((line) => line.split(','))
    // Find lines with page numbers in correct order
    .filter((pageNumbers) => {
      for (let i = 0; ++i < pageNumbers.length;) {
        const a = pageNumbers[i - 1];
        const b = pageNumbers[i];

        // If it's not in the wrong order, it's correct
        const isValid = !lookup.get(b)?.has(a);
        if (!isValid) return false;
      }

      return true;
    })
    // Sum of middle page numbers
    .reduce(
      (acc, pageNumbers) => {
        const midPoint = Math.floor(pageNumbers.length / 2);
        return acc + Number.parseInt(pageNumbers[midPoint], 10);
      },
      0,
    );

  console.log('total sum of middle page numbers of valid lines:', sum);
}

// Part 2 - Print middle number of incorrectly ordered lines after correctly
// sorting them
{
  const rules = lines.values()
    .filter((line) => line[2] === '|')
    .map((rule) => rule.split('|'));

  // Group rules by start
  const lookup = new Map(
    Object.entries(
      Object.groupBy(
        rules,
        (rule) => rule[0],
      ),
    ).map(([k, rules]) => [
      k,
      new Set(rules?.map((rule) => rule[1]) ?? []),
    ]),
  );

  const sum = lines.values()
    // Page numbers are delimited by ','
    .filter((line) => line[2] === ',')
    .map((line) => line.split(','))
    // Find lines with page numbers in incorrect order
    .filter((pageNumbers) => {
      for (let i = 0; ++i < pageNumbers.length;) {
        const a = pageNumbers[i - 1];
        const b = pageNumbers[i];

        // If it's not in the wrong order, it's correct
        const isValid = !lookup.get(b)?.has(a);
        if (!isValid) return true;
      }

      return false;
    })
    // Sort them into correct order
    .map((pageNumbers) =>
      pageNumbers.toSorted(
        (a, b) => {
          if (lookup.get(a)?.has(b)) return -1;
          if (lookup.get(b)?.has(a)) return 1;
          return 0;
        },
      )
    )
    // Sum of middle page numbers
    .reduce(
      (acc, pageNumbers) => {
        const midPoint = Math.floor(pageNumbers.length / 2);
        return acc + Number.parseInt(pageNumbers[midPoint], 10);
      },
      0,
    );

  console.log(
    'total sum of middle page numbers of invalid lines after sorting:',
    sum,
  );
}
