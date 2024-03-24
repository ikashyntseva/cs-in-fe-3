"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fizzbuzz = function* () {
    let nextIndex = 1n;
    const end = 100n;
    while (nextIndex <= end) {
        if (nextIndex % 15n === 0n)
            yield console.log("FizzBuzz");
        else if (nextIndex % 5n === 0n)
            yield console.log("Buzz");
        else if (nextIndex % 3n === 0n)
            yield console.log("Fizz");
        else
            yield console.log(nextIndex);
        nextIndex++;
    }
};
const myFizzBuzz = fizzbuzz();
myFizzBuzz.next();
myFizzBuzz.next();
myFizzBuzz.next();
myFizzBuzz.next();
myFizzBuzz.next();
myFizzBuzz.next();
``;
