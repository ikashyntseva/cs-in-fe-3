const fizzbuzz = function* () {
  let nextIndex = 1n;
  const end = 100n;

  while (nextIndex <= end) {
    if (nextIndex % 15n === 0n) yield console.log("FizzBuzz");
    else if (nextIndex % 5n === 0n) yield console.log("Buzz");
    else if (nextIndex % 3n === 0n) yield console.log("Fizz");
    else yield console.log(nextIndex);

    nextIndex++
  }
};

const myFizzBuzz = fizzbuzz();


myFizzBuzz.next(); // 1n
myFizzBuzz.next(); // 2n
myFizzBuzz.next(); // Fizz
myFizzBuzz.next(); // 4n
myFizzBuzz.next(); // Buzz
myFizzBuzz.next(); // Fizz
``