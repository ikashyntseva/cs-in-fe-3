const fizzbuzz = () => {
  let nextIndex = 1n;
  let iterationCount = 0n;
  const end = 100n;

  const iterator = {
    next() {
      let result;

      if (nextIndex <= end) {
        let value = nextIndex;

        if (nextIndex % 15n === 0n) value = "FizzBuzz";
        else if (nextIndex % 5n === 0n) value = "Buzz";
        else if (nextIndex % 3n === 0n) value = "Fizz";

        result = { value, done: false };
        nextIndex ++;
        iterationCount++;

        console.log(value);

        return result;
      }

      return { value: iterationCount, done: true };
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
