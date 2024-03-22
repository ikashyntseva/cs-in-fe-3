import { divmod, binary, createMask, getNumberLength } from "./helpers.js";

const Method = {
  Add: "add",
  Substract: "substract",
};

class Adder {
  _adder(n1, n2) {
    function halfAdder(n1, n2) {
      const s = n1 ^ n2;
      let p = n1 & n2;

      p = p === 0 ? p : p << 1;

      return {
        s,
        p,
      };
    }

    let res = halfAdder(n1, n2);

    while (res.p) {
      res = halfAdder(res.s, res.p);
    }

    return res.s;
  }

  _complementToNine(digit) {
    return 10 + ~digit;
  }

  evaluate(method, num) {
    const isAdd = method === Method.Add;
    const isSubstract = method === Method.Substract;

    let mask = createMask(4, 4);

    let res = 0;
    let pos = 0;
    let ind = -1;

    let previous = false;
    let next = false;

    while (pos < this.length) {
      previous = next;
      let isNormalized = false;
      const isLastDigit = pos === this.length - 1;
      const shift = pos * this._bcdDigitSize;
      const digit = this.get(ind);

      let d = num % 10;

      if (isSubstract) {
        d = this._complementToNine(d);
      }

      let sum = this._adder(digit, d);

      if (sum > 9 && !isNormalized) {
        sum = this._adder(sum, 6);
        isNormalized = true;
      }

      if (previous) {
        sum = this._adder(sum, 1);
      }

      if (sum > 9) {
        next = true;

        if (isLastDigit && !isNormalized) {
          sum = this._adder(sum, 6);
          isNormalized = true;
        } else if (isSubstract || (isAdd && isLastDigit)) {
          sum = sum & mask;
        }
      }

      res |= sum << shift;
      num = Math.floor(num / 10);

      if (isSubstract && next && isLastDigit) {
        res = this._adder(res, 1);
      }
      console.log(binary(res, 32));
      pos++;
      ind--;
    }
    return res;
  }

  add(num) {
    let mask = createMask(4, 4);

    let res = 0;
    let pos = 0;
    let ind = -1;

    let previous = false;
    let next = false;

    while (pos < this.length) {
      previous = next;
      let isNormalized = false;
      const isLastDigit = pos === this.length - 1;
      const shift = pos * this._bcdDigitSize;
      const digit = this.get(ind);

      let sum = this._adder(digit, num % 10);

      if (sum > 9 && !isNormalized) {
        sum = this._adder(sum, 6);
        isNormalized = true;
      }

      if (previous) {
        sum = this._adder(sum, 1);
      }

      if (sum > 9) {
        next = true;

        if (isLastDigit && !isNormalized) {
          sum = this._adder(sum, 6);
          isNormalized = true;
        } else if (!isLastDigit) {
          sum = sum & mask;
        }
      }

      res |= sum << shift;
      num = Math.floor(num / 10);

      pos++;
      ind--;
    }
    return res;
  }

  substract(num) {
    let mask = createMask(4, 4);

    let res = 0;
    let pos = 0;
    let ind = -1;

    let previous = false;
    let next = false;

    while (pos < this.length) {
      previous = next;
      let isNormalized = false;
      const isLastDigit = pos === this.length - 1;
      const shift = pos * this._bcdDigitSize;
      const digit = this.get(ind);

      let sum = this._adder(digit, this._complementToNine(num % 10));

      if (sum > 9 && !isNormalized) {
        sum = this._adder(sum, 6);
        isNormalized = true;
      }

      if (previous) {
        sum = adder(sum, 1);
      }

      if (sum > 9) {
        next = true;

        if (isLastDigit && !isNormalized) {
          sum = this._adder(sum, 6);
          isNormalized = true;
        } else {
          sum &= mask;
        }
      }

      res |= sum << shift;
      num = Math.floor(num / 10);

      if (next && isLastDigit) {
        res = adder(res, 1);
      }

      pos++;
      ind--;
    }
    console.log(binary(res, 32));
    return res;
  }
}

export class BCD extends Adder {
  _bcdDigitsLimit = 7;
  _bcdDigitSize = 4;

  constructor(number) {
    super();
    this.number = number;
    this.length = getNumberLength(Math.abs(number));
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

  getDigit(digit) {
    return this.isNegative ? this._complementToNine(digit) : digit;
  }


  convertToBcd() {
    let result = [];
    let number = Math.abs(this.number);

    while (number) {
      const numberLength = getNumberLength(number);
      const isWithinLimit = numberLength <= this._bcdDigitsLimit;
      const pow = isWithinLimit ? 0 : numberLength - this._bcdDigitsLimit;

      let [firstNumber, secondNumber] = divmod(number, 10 ** pow);

      let value = 0;
      let pos = 0;

      if (this.isNegative && !result.length) {
        value |= 1 << (this._bcdDigitSize * this._bcdDigitsLimit);
      }

      while (firstNumber) {
        let digit = this.getDigit(firstNumber % 10);
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
    const numberLength = this.length;
    const { col, pos } = this.getShiftData(ind, numberLength);

    let number = this.numbers[col];

    const mask = createMask(this._bcdDigitSize, this._bcdDigitSize * (pos + 1));
    const union = number & mask;
    const shift = pos * this._bcdDigitSize;

    const digit = this.getDigit(pos ? union >>> shift : union);

    return digit;
  }

  add(num) {
    return this.evaluate("add", num);
  }

  substract(num) {
    return this.evaluate("substract", num);
  }
}
