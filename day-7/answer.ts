// setup
console.log('---Day 7---');

const text = Deno.readTextFileSync(new URL('./input.txt', import.meta.url));
const equations = text.split('\n')
  .map((equation) => {
    const [_result, _operands] = equation.split(':');

    const result = Number.parseInt(_result, 10);
    const operands = _operands
      .trim()
      .split(' ')
      .map((v) => Number.parseInt(v, 10));

    return [result, ...operands];
  });

// Part 1 - Figure out results of valid operations
// Valid operations calculate results by either adding/multiplying operands
// in left-to-right order
{
  // Recursively check whether operands add/multiply to a given result
  // Needs operands to be reversed
  const isValidEquation = (
    result: number,
    operands: ReadonlyArray<number>,
  ): boolean => {
    if (!result) return true;
    if (!operands.length) return false;

    const [operand, ...remaining] = operands;

    const interimMultiply = result / operand;
    const interimSum = result - operand;

    if (remaining.length === 1) {
      // Case: a + b = result
      // Therefore a = result - b
      return interimSum === remaining[0] ||
        // Case: a * b = result
        // Therefore a = result / b
        interimMultiply === remaining[0];
    }

    // There are only integers in the list of operands
    // so we can skip this isn't the case
    const canContinueCheckingMultiply = Number.isSafeInteger(interimMultiply);

    // We can still check if the remainder is positive
    // and there are operands left to subtract
    const canContinueCheckingSum = interimSum > 0;

    return (canContinueCheckingMultiply &&
      isValidEquation(interimMultiply, remaining)) ||
      (canContinueCheckingSum && isValidEquation(interimSum, remaining));
  };

  const sumValidResults = equations
    .map(([result, ...operands]) =>
      isValidEquation(
          result,
          // Reverse operands so we can check them right-to-left
          operands.toReversed(),
        )
        ? result
        : 0
    )
    .reduce((acc, v) => acc + v, 0);

  console.log('sum of results for valid equations:', sumValidResults);
}

// Part 2 - Figure out results of valid operations
// Same as part 1, but with the ability to concatenate operands
{
  // Recursively check whether operands add/concatenate/multiply to a given result
  // Needs operands to be reversed
  const isValidEquation = (
    result: number,
    operands: ReadonlyArray<number>,
  ): boolean => {
    if (!result) return true;
    if (!operands.length) return false;

    const [operand, ...remaining] = operands;

    const interimMultiply = result / operand;
    const interimSum = result - operand;

    const _interimSplit = result.toString(10);
    const interimSplit = _interimSplit.endsWith(operand.toString(10))
      ? _interimSplit.slice(
        0,
        _interimSplit.lastIndexOf(operand.toString(10)),
      )
      : undefined;

    if (remaining.length === 1) {
      // Case: a + b = result
      // Therefore a = result - b
      return interimSum === remaining[0] ||
        // Case: a * b = result
        // Therefore a = result / b
        interimMultiply === remaining[0] ||
        // Case: a (concat) b = result
        // Therefore a = result (split and remove) b
        interimSplit === remaining[0].toString(10);
    }

    // There are only integers in the list of operands
    // so we can skip this isn't the case
    const canContinueCheckingMultiply = Number.isSafeInteger(interimMultiply);

    // We can still check if the remainder is positive
    // and there are operands left to subtract
    const canContinueCheckingSum = interimSum > 0;

    const canContinueCheckingSplit = !!interimSplit;

    return (canContinueCheckingMultiply &&
      isValidEquation(interimMultiply, remaining)) ||
      (canContinueCheckingSum && isValidEquation(interimSum, remaining)) ||
      (canContinueCheckingSplit &&
        isValidEquation(Number.parseInt(interimSplit, 10), remaining));
  };

  const sumValidResults = equations
    .map(([result, ...operands]) =>
      isValidEquation(
          result,
          // Reverse operands so we can check them right-to-left
          operands.toReversed(),
        )
        ? result
        : 0
    )
    .reduce((acc, v) => acc + v, 0);

  console.log('sum of results for valid equations:', sumValidResults);
}
