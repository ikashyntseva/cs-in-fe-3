import {
  binary,
  divmod,
  getIsResultNegative,
  getMask,
  getNextNumber,
  getNumberLength,
  trim,
} from "./helpers.js";

const Method = {
  Add: "add",
  Substract: "subtract",
};

class Adder {
  adder(n1: number, n2: number, carry: 0 | 1 = 0) {
    function halfAdder(n1: number, n2: number) {
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

export class BCD extends Adder {
  private mask = 0b1111;
  private _bcdDigitSize = 4;
  private _defaultBcdDigitsLimit = 7;
  private _firstBcdDigitsLimit = 6;

  private number: BigInt;
  private numbers: number[] = [];
  private bcd = 0;

  constructor(number: BigInt) {
    super();
    this.number = number;
    this.numbers = this.toBcd();
  }

  get isNegative(): boolean {
    return (this.numbers[0] & getMask(6)) >>> 24 !== 0;
  }

  private get lengthOfLastNumber() {
    return (getMask(7) & (this.numbers.at(-1) as number)) >>> 28;
  }

  private set lengthOfLastNumber(num: number) {
    this.bcd |=
      getNumberLength(num) <<
      (this._bcdDigitSize * this._defaultBcdDigitsLimit);
  }

  private complementToNine(digit: number) {
    return 10 + ~digit;
  }

  private getDigitsLimit(ind: number) {
    return ind <= this._firstBcdDigitsLimit
      ? this._firstBcdDigitsLimit
      : this._defaultBcdDigitsLimit;
  }

  private getNumberPos(ind: number): {
    number: number;
    pos: number;
  } | null {
    const numberLength = getNumberLength(this.number);

    if (Math.abs(ind) > numberLength) return null;

    ind = ind < 0 ? ind + numberLength : ind;

    const digitsLimit = this.getDigitsLimit(ind);

    const col = Math.floor(Math.abs(ind) / digitsLimit);

    let pos = numberLength - ind - 1;

    if (pos >= this.lengthOfLastNumber) {
      pos -= this.lengthOfLastNumber;
    }

    return {
      number: this.numbers.at(col) as number,
      pos,
    };
  }

  private getResolvedBcdDigit(
    digit: number,
    isNegative: boolean = this.isNegative
  ) {
    return isNegative ? this.complementToNine(Math.abs(digit)) : digit;
  }

  private setSign(number: number) {
    return number | (1 << 24);
  }

  private set isNegative(sign: boolean) {
    this.bcd |= Number(sign) << 24;
  }

  private getPow(num: number, res: number[]) {
    const numberLength = getNumberLength(num);
    const digitsLimit = res.length
      ? this._defaultBcdDigitsLimit
      : this._firstBcdDigitsLimit;
    const isWithinLimit = numberLength <= digitsLimit;

    return isWithinLimit ? 0 : numberLength - digitsLimit;
  }

  private setBcdDigit(digit: number, pos: number) {
    this.bcd |= digit << (pos * this._bcdDigitSize);
  }

  private toBcd() {
    let result = [];
    let number = Number(this.number);
    const isNegative = number < 0;

    console.log("isNegative: ", number);

    while (number) {
      this.bcd = 0;
      let pos = 0;

      let [chunk, nextChunk] = divmod(
        Math.abs(number),
        10 ** this.getPow(number, result)
      );

      if (isNegative && !result.length) {
        // this.isNegative = true;
        this.bcd = this.setSign(this.bcd);
      }

      // Set length of the last number
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

  valueOf() {
    console.log(
      "NUMBERS: ",
      this.numbers.map((n) => binary(n, 32))
    );

    return this.numbers.map(BigInt).reduce((combinedNumber, number, ind) => {
      const pos = this.lengthOfLastNumber || this._defaultBcdDigitsLimit;

      if (ind === 1) {
        combinedNumber = trim(combinedNumber, 5);
      }

      number = trim(number, 6);

      return (combinedNumber << BigInt(pos * this._bcdDigitSize)) | number;
    });
  }

  get(ind: number) {
    const shiftData = this.getNumberPos(ind);

    if (!shiftData) {
      return "Digit was not found";
    }

    const { number, pos } = shiftData;

    const union = number & getMask(pos);

    return this.getResolvedBcdDigit(union >>> (pos * this._bcdDigitSize));
  }

  private resolvedBcdSum(isAddendNegative: boolean, areAddendsEqual: boolean) {
    return (a: number, b: number, carry: 0 | 1 = 0) => {
      const digits = [
        { digit: a, isNegative: this.isNegative },
        { digit: b, isNegative: isAddendNegative },
      ];

      const [rDigit1, rDigit2] = digits.map(({ digit, isNegative }) =>
        this.getResolvedBcdDigit(digit % 10, isNegative)
      );

      let sum = this.adder(rDigit1, rDigit2, carry);

      if (sum > 9) {
        carry = 1;

        sum = this.adder(sum, 6) & this.mask;
      } else {
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

  add(addend: number) {
    let number = Number(this.number);
    let res = 0;
    let pos = 0;

    let previousCarry: 0 | 1 = 0;
    let isResultNegative = getIsResultNegative(number, addend);

    const isAddendNegative = addend < 0;
    const areAddendsEqual = Math.abs(number) === Math.abs(addend);
    const end = Math.max(getNumberLength(number), getNumberLength(addend));

    const resolvedBcdSum = this.resolvedBcdSum(
      isAddendNegative,
      areAddendsEqual
    );

    if (isResultNegative) {
      res = this.setSign(res);
    }

    while (pos < end) {
      const shift = pos * this._bcdDigitSize;

      let { sum, carry } = resolvedBcdSum(number, addend, previousCarry);

      previousCarry = carry;

      res |= sum << shift;

      number = getNextNumber(number);
      addend = getNextNumber(addend);

      pos++;
    }

    /**  Normalize result for cases:
     * - One of the operands is negative, but the result is positive
     * - Both of the operands are negative
     */
    if (
      ((this.isNegative || isAddendNegative) &&
        !isResultNegative &&
        !areAddendsEqual) ||
      (this.isNegative && isAddendNegative)
    ) {
      res = this.adder(res, 1);
    }

    console.log("sum: ", binary(res, 32));
    return res;
  }

  subtract(num: number) {
    const number = ~num + 1;

    return this.add(number);
  }
}
