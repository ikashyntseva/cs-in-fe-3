export const binary = (num, pad) => {
  const str = new Uint32Array([num])[0].toString(2);
  return str.padStart(pad, "0").replace(/(.{4})(?!$)/g, "$1_");
};

export const divmod = (x, y) => [Math.floor(x / y), x % y];

export const getNumberLength = (num) => Math.floor(Math.log10(num) + 1);

export const createMask = (len, pos) => {
  let r = ~0;
  r <<= 32 - len;
  r >>>= 32 - pos;

  return r;
};
