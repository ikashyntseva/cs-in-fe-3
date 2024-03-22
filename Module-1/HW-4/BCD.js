import { divmod, binary, createMask, getNumberLength } from "./helpers.js";

export class BCD {
  _bcdDigitsLimit = 7;
  _bcdDigitSize = 4;

  constructor(number) {
    this.number = number;
    this.isNegative = number < 0;
    this.numbers = this.convertToBcd();
  }

  getShiftData(ind, numberLength) {
    const i = ind >= 0 ? ind : numberLength + ind;
    const pos = ind >= 0 ? numberLength - ind : ~ind + 1;

    return {
      col: Math.floor(i / this._bcdDigitsLimit),
      pos: pos - 1,
    };
  }

  convertToBcd() {
    let result = [];
    let number = this.number;

    while (number) {
      const numberLength = getNumberLength(number);
      const isWithinLimit = numberLength <= this._bcdDigitsLimit;
      const pow = isWithinLimit ? 0 : numberLength - this._bcdDigitsLimit;

      let [firstNumber, secondNumber] = divmod(number, 10 ** pow);

      let value = 0;
      let pos = 0;

      while (firstNumber) {
        let digit = firstNumber % 10;
        const shift = pos * this._bcdDigitSize;

        value |= digit << shift;
        firstNumber = Math.floor(firstNumber / 10);

        pos++;
      }

      number = secondNumber;

      result.push(value);
    }

    return result;
  }

  valueOf() {
    console.log(
      "NUMBERS: ",
      this.numbers.map((n) => binary(n, 32))
    );
    return this.numbers.reduce((combinedNumber, number) => {
      const numberLength = getNumberLength(number);
      const pos = BigInt(this._bcdDigitSize * numberLength);

      return (BigInt(combinedNumber) << pos) | BigInt(number);
    });
  }

  get(ind) {
    const numberLength = getNumberLength(this.number);
    const { col, pos } = this.getShiftData(ind, numberLength);

    const digit = this.numbers[col];
    const mask = createMask(this._bcdDigitSize, this._bcdDigitSize * (pos + 1));
    const union = digit & mask;
    const shift = pos * this._bcdDigitSize;

    return pos ? union >>> shift : union;
  }
}
