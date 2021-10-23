// I have array of values

const enumValues = ["Read", "Eval", "Print"];

// I want to generate some code
for (let i = 0; i < enumValues.length; i++) {
  const enumValue = enumValues[i];
  writeline(`const ${enumValue.toUpperCase()} = ${i};`);
}
