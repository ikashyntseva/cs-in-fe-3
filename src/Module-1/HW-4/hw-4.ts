import { BCD } from "./BCD";

let n = new BCD(65536n);

// console.log(n.valueOf()); // 0b0000_0000_0110_0101_0101_0011_0110 or 415030n

// console.log(n.get(0)); // 6
// console.log(n.get(1)); // 5

// console.log(n.get(-1)); // 6
// console.log(n.get(-2)); // 3

// n = new BCD(-23n);
// console.log(n.valueOf()); // 0b0000_0001_0000_0000_0000_0111_0111 or 77

// console.log(n.get(0)); // 2
// console.log(n.get(1)); // 3

// console.log(n.isNegative); // true

n = new BCD(-1n);

console.log(n.add(-10)); // 0b0000_0000_0000_0000_0000_0010_0101 or 37

// console.log(n.subtract(10)); // 0b00010000 или 16

// console.log(n.subtract(-10)); // 0b0000_0000_0000_0000_0000_0010_0000 or 32, cause - and - => +
