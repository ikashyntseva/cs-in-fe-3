import { BCD } from "./BCD";
import { binary } from "./helpers";

describe("BCD", () => {
  test("Should return correct result for the valueOf method", () => {
    expect(new BCD(65536n).valueOf()).toBe(415030n); // case with one number in array

    expect(new BCD(123456789n).valueOf()).toBe(4886718345n); // case with more than one number in array
  });

  test("Should correctly convert negative numbers using complement to 9 algorithm", () => {
    const n = new BCD(-65536n);

    expect(n.valueOf()).toBe(16991331n);

    expect(n.isNegative).toBeTruthy();
  });

  test("Should correctly get digit by index", () => {
    const n = new BCD(-65536n);

    expect(n.get(0)).toBe(6);
    expect(n.get(1)).toBe(5);

    expect(n.get(-1)).toBe(6);
    expect(n.get(-2)).toBe(3);
  });

  test("Should correctly evaluate sum of 2 positive numbers", () => {
    const n = new BCD(10n);

    const sum = n.add(15); // 0b0000_0000_0000_0000_0000_0000_0010_0101

    expect(sum).toBe(37);
  });

  test("Should correctly evaluate sum of 2 numbers, when only one of them is negative", () => {
    const n = new BCD(5n);

    let sum = n.add(-1); // Result is positive

    expect(sum).toBe(4);

    sum = n.add(-6); // Result is negative

    expect(binary(sum, 32)).toBe("0000_0001_0000_0000_0000_0000_0000_1000");
  });

  test("Should correctly evaluate sum of 2 negative numbers", () => {
    const n = new BCD(-10n);

    let sum = n.add(-1);

    expect(binary(sum, 32)).toBe("0000_0001_0000_0000_0000_0000_1000_1000");
  });

  test("Should correctly evaluate difference of 2 positive numbers", () => {
    let n = new BCD(26n);

    // Result is positive
    let diff = n.subtract(15); // 0b0000_0000_0000_0000_0000_0000_0001_0001

    expect(diff).toBe(17);

    n = new BCD(1n);

    // Result is negative
    diff = n.subtract(2);

    expect(binary(diff, 32)).toBe("0000_0001_0000_0000_0000_0000_0000_1000");
  });

  test("Should correctly evaluate difference of 2 numbers, when only one of them is negative", () => {
    let n = new BCD(1n);

    // When subtrahend is negative the -- works as addition (- => +)
    // Result is positive
    let diff = n.subtract(-23); // 0b0000_0000_0000_0000_0000_0000_0010_0100

    expect(diff).toBe(36);

    n = new BCD(-5n);

    // Result is negative
    diff = n.subtract(1);

    expect(binary(diff, 32)).toBe("0000_0001_0000_0000_0000_0000_0000_0011");
  });

  test("Should correctly evaluate difference of 2 negative numbers", () => {
    const n = new BCD(-67n);

    let diff = n.subtract(-2);

    // Result is negative
    expect(binary(diff, 32)).toBe("0000_0001_0000_0000_0000_0000_0011_0100");

    diff = n.subtract(-678);

    // When subtrahend is negative the -- works as addition (- => +)
    // Result is positive
    expect(binary(diff, 32)).toBe("0000_0000_0000_0000_0000_0110_0001_0001");
  });

  test("Should correctly evaluate difference of 2 same numbers", () => {
    const n = new BCD(10n);

    let diff = n.subtract(10);

    // Result is 0
    expect(diff).toBe(0);

    diff = n.add(-10);

    // Result is 0
    expect(diff).toBe(0);
  });
});
