"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BCD = void 0;
const helpers_1 = require("./helpers");
class Adder {
    adder(n1, n2, carry = 0) {
        function halfAdder(n1, n2) {
            const sum = n1 ^ n2;
            let carry = n1 & n2;
            carry = carry === 0 ? carry : carry << 1;
            return {
                sum,
                carry,
            };
        }
        let res = halfAdder(n1, n2);
        while (res.carry) {
            res = halfAdder(res.sum, res.carry);
        }
        let { sum } = res;
        if (carry) {
            sum = this.adder(sum, carry);
        }
        return sum;
    }
}
class BCD extends Adder {
    mask = 0b1111;
    _bcdDigitSize = 4;
    _defaultBcdDigitsLimit = 7;
    _firstBcdDigitsLimit = 6;
    number;
    numbers = [];
    bcd = 0;
    constructor(number) {
        super();
        this.number = number;
        this.numbers = this.toBcd();
    }
    get isNegative() {
        return (this.numbers[0] & (0, helpers_1.getMask)(6)) >>> 24 !== 0;
    }
    get lengthOfLastNumber() {
        return ((0, helpers_1.getMask)(7) & this.numbers.at(-1)) >>> 28;
    }
    set lengthOfLastNumber(num) {
        this.bcd |=
            (0, helpers_1.getNumberLength)(num) <<
                (this._bcdDigitSize * this._defaultBcdDigitsLimit);
    }
    complementToNine(digit) {
        return 10 + ~digit;
    }
    getDigitsLimit(ind) {
        return ind <= this._firstBcdDigitsLimit
            ? this._firstBcdDigitsLimit
            : this._defaultBcdDigitsLimit;
    }
    getNumberPos(ind) {
        const numberLength = (0, helpers_1.getNumberLength)(this.number);
        if (Math.abs(ind) > numberLength)
            return null;
        ind = ind < 0 ? ind + numberLength : ind;
        const digitsLimit = this.getDigitsLimit(ind);
        const col = Math.floor(Math.abs(ind) / digitsLimit);
        let pos = numberLength - ind - 1;
        if (pos >= this.lengthOfLastNumber) {
            pos -= this.lengthOfLastNumber;
        }
        return {
            number: this.numbers.at(col),
            pos,
        };
    }
    getResolvedBcdDigit(digit, isNegative = this.isNegative) {
        return isNegative ? this.complementToNine(Math.abs(digit)) : digit;
    }
    setSign(number) {
        return number | (1 << 24);
    }
    getPow(num, res) {
        const numberLength = (0, helpers_1.getNumberLength)(num);
        const digitsLimit = res.length
            ? this._defaultBcdDigitsLimit
            : this._firstBcdDigitsLimit;
        const isWithinLimit = numberLength <= digitsLimit;
        return isWithinLimit ? 0 : numberLength - digitsLimit;
    }
    setBcdDigit(digit, pos) {
        this.bcd |= digit << (pos * this._bcdDigitSize);
    }
    toBcd() {
        let result = [];
        let number = Number(this.number);
        const isNegative = number < 0;
        while (number) {
            this.bcd = 0;
            let pos = 0;
            let [chunk, nextChunk] = (0, helpers_1.divmod)(Math.abs(number), 10 ** this.getPow(number, result));
            if (isNegative && !result.length) {
                this.bcd = this.setSign(this.bcd);
            }
            if (!nextChunk && result.length) {
                this.lengthOfLastNumber = chunk;
            }
            while (chunk) {
                this.setBcdDigit(this.getResolvedBcdDigit(chunk % 10, isNegative), pos);
                chunk = Math.floor(chunk / 10);
                pos++;
            }
            number = nextChunk;
            result.push(this.bcd);
        }
        return result;
    }
    get length() {
        return (0, helpers_1.getNumberLength)(this.number);
    }
    valueOf() {
        console.log("NUMBERS: ", this.numbers.map((n) => (0, helpers_1.binary)(n, 32)));
        return this.numbers.map(BigInt).reduce((combinedNumber, number, ind) => {
            const pos = this.lengthOfLastNumber || this._defaultBcdDigitsLimit;
            if (ind === 1) {
                combinedNumber = (0, helpers_1.trim)(combinedNumber, 5);
            }
            number = (0, helpers_1.trim)(number, 6);
            return (combinedNumber << BigInt(pos * this._bcdDigitSize)) | number;
        });
    }
    get(ind) {
        const shiftData = this.getNumberPos(ind);
        if (!shiftData) {
            return 0;
        }
        const { number, pos } = shiftData;
        const union = number & (0, helpers_1.getMask)(pos);
        return this.getResolvedBcdDigit(union >>> (pos * this._bcdDigitSize));
    }
    resolvedBcdSum(areAddendsEqual) {
        return (a, b, carry = 0) => {
            let sum = this.adder(a, b, carry);
            if (sum > 9) {
                carry = 1;
                sum = this.adder(sum, 6) & this.mask;
            }
            else {
                carry = 0;
            }
            if (areAddendsEqual && sum === 9) {
                sum = this.complementToNine(sum);
            }
            return {
                sum,
                carry,
            };
        };
    }
    *ranks() {
        for (const [numInd, num] of this.numbers.entries()) {
            let pos = 0;
            while (pos < this._defaultBcdDigitsLimit) {
                const isSign = +numInd === 0 && pos === 6;
                if (!isSign) {
                    let rank = (num & (0, helpers_1.getMask)(pos)) >>> (pos * this._bcdDigitSize);
                    if (pos >= this.length && this.isNegative) {
                        rank = this.complementToNine(0);
                    }
                    yield {
                        rank,
                        pos,
                    };
                }
                pos++;
            }
        }
    }
    add(addend) {
        let number = Number(this.number);
        let bcd = this;
        let bcdAddend = new BCD(BigInt(addend));
        let res = 0;
        let previousCarry = 0;
        let isResultNegative = (0, helpers_1.getIsResultNegative)(number, addend);
        const isBcdNegative = bcd.isNegative;
        const isAddendNegative = bcdAddend.isNegative;
        const areAddendsEqual = Math.abs(number) === Math.abs(addend);
        const max = Math.max((0, helpers_1.getNumberLength)(number), (0, helpers_1.getNumberLength)(addend));
        const resolvedBcdSum = this.resolvedBcdSum(isAddendNegative);
        if (isResultNegative) {
            res = this.setSign(res);
        }
        for (const { rank, pos } of bcd.ranks()) {
            if (pos >= max)
                break;
            const shift = pos * this._bcdDigitSize;
            let { sum, carry } = resolvedBcdSum(rank, bcdAddend.getResolvedBcdDigit(bcdAddend.get(~pos)), previousCarry);
            previousCarry = carry;
            res |= sum << shift;
        }
        if (((isBcdNegative || isAddendNegative) &&
            !isResultNegative &&
            !areAddendsEqual) ||
            (isBcdNegative && isAddendNegative)) {
            res = this.adder(res, 1);
        }
        return res;
    }
    subtract(num) {
        const number = ~num + 1;
        return this.add(number);
    }
}
exports.BCD = BCD;
