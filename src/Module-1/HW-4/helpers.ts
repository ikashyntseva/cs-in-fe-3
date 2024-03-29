export const binary = (num: number, pad: number) => {
  const str = new Uint32Array([num])[0].toString(2);
  return str.padStart(pad, "0").replace(/(.{4})(?!$)/g, "$1_");
};

export const divmod = (x: number, y: number) => [Math.floor(x / y), x % y];

export const getNumberLength = (num: BigInt | number) => {
  return Math.floor(Math.log10(Math.abs(Number(num))) + 1);
};

export const getMask = (i: number, fullLength: boolean = false) => {
  const bcdSize = 4;
  let size = bcdSize;

  if (fullLength) size = (i + 1) * bcdSize;

  return (~0 << (32 - size)) >>> (32 - (i + 1) * bcdSize);
};

export const trim = (num: BigInt, ind: number) => {
  const res = Number(num) & getMask(ind, true);
  return BigInt(res);
};

export const getIsResultNegative = (num1: number, num2: number) => {
  function isNegative(a: number, b: number) {
    return a < 0 && Math.abs(a) > b;
  }

  return isNegative(num1, num2) || isNegative(num2, num1);
};

export function getNextNumber(num: number) {
  if (num < 0) {
    return Math.ceil(num / 10);
  }

  return Math.floor(num / 10);
}
