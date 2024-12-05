// Setup
console.log('---Day 5---');

const text = Deno.readTextFileSync(new URL('./input.txt', import.meta.url));
const lines = text.split(/\n+/);

// Part 1 - Print middle number of correctly ordered lines
{
  const rules = lines.values()
    .filter((line) => line[2] === '|')
    .toArray();

  const ruleNumbers = new Set(
    rules
      .flatMap((rule) => rule.split('|')),
  );

  const sortedRuleNumbers = ruleNumbers
    .values()
    .toArray()
    .sort((a, b) => {
      const after = `${a}|${b}`;
      const before = `${b}|${a}`;

      for (const rule of rules) {
        if (rule === before) return -1;
        else if (rule === after) return 1;
      }

      return 0;
    });

  const sum = lines.values()
    .filter((line) => line[2] === ',')
    .map((line) => {
      const pageNumbers = line.split(',');
      for (let i = 0; ++i < pageNumbers.length;) {
        const a = pageNumbers[i - 1];
        const b = pageNumbers[i];

        const aIndex = sortedRuleNumbers.indexOf(a);
        const bIndex = sortedRuleNumbers.indexOf(b);

        if (bIndex > aIndex) return 0;
      }

      const midPoint = Math.floor(pageNumbers.length / 2);
      return Number.parseInt(pageNumbers[midPoint], 10);
    })
    .reduce((acc, v) => acc + v, 0);

  console.log('total sum of middle page numbers of valid lines:', sum);
}
