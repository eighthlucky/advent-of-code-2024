// Wait for array of values to come through
const { promise, resolve } = Promise.withResolvers<number[]>();
globalThis.addEventListener(
  'message',
  (e: MessageEvent) => resolve(e.data),
  { once: true, passive: true },
);
const values = await promise;

// Apply rules over array
const insert: [value: number, index: number][] = [];
for (let i = 0; i < values.length; i++) {
  const value = values[i];

  // Case: 0 -> 1
  if (value === 0) {
    values[i] = 1;
    continue;
  }

  // Case: even digits -> split
  const valueAsString = value.toString(10);
  if (valueAsString.length % 2 === 0) {
    const digitsPerSide = valueAsString.length / 2;

    // Mark for insert later
    const right = Number.parseInt(
      valueAsString.slice(digitsPerSide),
      10,
    );
    insert.push([right, i + 1]);

    // Update current stone with the remaining value
    const left = valueAsString.slice(0, digitsPerSide);
    values[i] = Number.parseInt(left, 10);

    continue;
  }

  // Case: other -> multiply 2024
  values[i] *= 2024;
}

// insert split digits
for (const [value, i] of insert) {
  values.splice(i, 0, value);
}

// Send data back to main thread
globalThis.postMessage(values);
