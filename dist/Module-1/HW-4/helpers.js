"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextNumber = exports.getIsResultNegative = exports.trim = exports.getMask = exports.getNumberLength = exports.divmod = exports.binary = void 0;
const binary = (num, pad) => {
    const str = new Uint32Array([num])[0].toString(2);
    return str.padStart(pad, "0").replace(/(.{4})(?!$)/g, "$1_");
};
exports.binary = binary;
const divmod = (x, y) => [Math.floor(x / y), x % y];
exports.divmod = divmod;
const getNumberLength = (num) => {
    return Math.floor(Math.log10(Math.abs(Number(num))) + 1);
};
exports.getNumberLength = getNumberLength;
const getMask = (i, fullLength = false) => {
    const bcdSize = 4;
    let size = bcdSize;
    if (fullLength)
        size = (i + 1) * bcdSize;
    return (~0 << (32 - size)) >>> (32 - (i + 1) * bcdSize);
};
exports.getMask = getMask;
const trim = (num, ind) => {
    const res = Number(num) & (0, exports.getMask)(ind, true);
    return BigInt(res);
};
exports.trim = trim;
const getIsResultNegative = (num1, num2) => {
    function isNegative(a, b) {
        return a < 0 && Math.abs(a) > b;
    }
    return isNegative(num1, num2) || isNegative(num2, num1);
};
exports.getIsResultNegative = getIsResultNegative;
function getNextNumber(num) {
    if (num < 0) {
        return Math.ceil(num / 10);
    }
    return Math.floor(num / 10);
}
exports.getNextNumber = getNextNumber;
