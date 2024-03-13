const fizzbuzz = () => {
  let nextIndex = 1n;
  const end = 100n;

  const iterator = {
    next() {
      const done = nextIndex > end;

      if (!done) {
        if (nextIndex % 15n === 0n) console.log("FizzBuzz");
        else if (nextIndex % 5n === 0n) console.log("Buzz");
        else if (nextIndex % 3n === 0n) console.log("Fizz");
        else console.log(nextIndex);

        nextIndex++;
      }

      return { value: nextIndex, done };
    },
  };

  return iterator;
};

const myFizzBuzz = fizzbuzz();

myFizzBuzz.next(); // 1n
myFizzBuzz.next(); // 2n
myFizzBuzz.next(); // Fizz
myFizzBuzz.next(); // 4n
myFizzBuzz.next(); // Buzz
myFizzBuzz.next(); // Fizz
