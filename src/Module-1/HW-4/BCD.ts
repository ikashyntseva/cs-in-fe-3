import {
  binary,
  divmod,
  getIsResultNegative,
  getMask,
  getNumberLength,
  trim,
} from "./helpers";

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
    let result: number[] = [];
    let number = Number(this.number);
    const isNegative = number < 0;

    while (number) {
      this.bcd = 0;
      let pos = 0;

      let [chunk, nextChunk] = divmod(
        Math.abs(number),
        10 ** this.getPow(number, result)
      );

      if (isNegative && !result.length) {
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

  private get length() {
    return getNumberLength(this.number);
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
      return 0;
    }

    const { number, pos } = shiftData;

    const union = number & getMask(pos);

    return this.getResolvedBcdDigit(union >>> (pos * this._bcdDigitSize));
  }

  private resolvedBcdSum(areAddendsEqual: boolean) {
    return (a: number, b: number, carry: 0 | 1 = 0) => {
      let sum = this.adder(a, b, carry);

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

  *ranks() {
    for (const [numInd, num] of this.numbers.entries()) {
      let pos = 0;

      while (pos < this._defaultBcdDigitsLimit) {
        const isSign = +numInd === 0 && pos === 6;

        if (!isSign) {
          let rank = (num & getMask(pos)) >>> (pos * this._bcdDigitSize);

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

  add(addend: number) {
    let number = Number(this.number);

    let bcd: BCD = this;
    let bcdAddend = new BCD(BigInt(addend));

    let res = 0;

    let previousCarry: 0 | 1 = 0;
    let isResultNegative = getIsResultNegative(number, addend);

    const isBcdNegative = bcd.isNegative;
    const isAddendNegative = bcdAddend.isNegative;
    const areAddendsEqual = Math.abs(number) === Math.abs(addend);
    const max = Math.max(getNumberLength(number), getNumberLength(addend));

    const resolvedBcdSum = this.resolvedBcdSum(isAddendNegative);

    if (isResultNegative) {
      res = this.setSign(res);
    }

    for (const { rank, pos } of bcd.ranks()) {
      if (pos >= max) break;

      const shift = pos * this._bcdDigitSize;

      let { sum, carry } = resolvedBcdSum(
        rank,
        bcdAddend.getResolvedBcdDigit(bcdAddend.get(~pos)),
        previousCarry
      );

      previousCarry = carry;

      res |= sum << shift;
    }

    /**  Normalize result for cases:
     * - One of the operands is negative, but the result is positive
     * - Both of the operands are negative
     */
    if (
      ((isBcdNegative || isAddendNegative) &&
        !isResultNegative &&
        !areAddendsEqual) ||
      (isBcdNegative && isAddendNegative)
    ) {
      res = this.adder(res, 1);
    }

    return res;
  }

  subtract(num: number) {
    const number = ~num + 1;

    return this.add(number);
  }
}
