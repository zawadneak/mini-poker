// 1000 => 1k
// 1000000 => 1m
// etc
export function parseMoneyQuantity(number) {
  const suffixes = ["", "k", "m", "b", "t"];
  const suffixNum = Math.floor(("" + number).length / 3);

  if (suffixNum === 0) return number;

  if (number > 1000 && number < 1000000) {
    return Math.floor(number / 1000).toFixed(0) + "k";
  }
  const shortValue = parseFloat(
    (suffixNum !== 0 ? number / Math.pow(1000, suffixNum) : number).toPrecision(
      3
    )
  );

  // Check if we need to round up to the next number
  if (shortValue % 1 !== 0) {
    return shortValue.toString() + suffixes[suffixNum];
  }

  return Math.floor(shortValue) + suffixes[suffixNum];
}

// beautify money string
export function parseMoneyExact(value: number): string {
  if (value < 1000) {
    return value.toString();
  }

  const str = value.toString();
  const parts = [];

  for (let i = str.length - 1, j = 0; i >= 0; i--, j++) {
    if (j > 0 && j % 3 === 0) {
      parts.unshift(".");
    }
    parts.unshift(str[i]);
  }

  return parts.join("");
}
