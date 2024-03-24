const instructions = {
  "SET A": 0,
  "PRINT A": 1,
  "IFN A": 2,
  RET: 3,
  "DEC A": 4,
  JMP: 5,
  "PRINT TEST": 6,
  "IF EVEN A": 7,
};

const program = [
  // Ставим значения аккумулятора
  instructions["SET A"],
  // В 10
  10,

  // Выводим значение на экран
  instructions["PRINT A"],

  // Если A равно 0
  instructions["IFN A"],

  [
    // Выводим TEST на экран
    instructions["PRINT TEST"],

    // Выводим TEST на экран
    instructions["PRINT TEST"],

    // Программа завершается
    instructions["RET"],

    // И возвращает 0
    0,
  ],

  // Уменьшаем A на 1
  instructions["DEC A"],

  // Если A чётное
  instructions["IF EVEN A"],

  // Выводим значение на экран
  instructions["PRINT A"],

  // Устанавливаем курсор выполняемой инструкции
  instructions["JMP"],

  // В значение 2
  2,
];

const interpreter = (pr) => {
  let a;

  const move = (instr, ind) => {
    const hasOperand = [0, 2, 3, 5, 7];

    if (!hasOperand.includes(instr)) {
      ind++;
    } else {
      const operandInd = ind + 1;
      const operand = pr[operandInd];

      if (instr !== 2) {
        ind += 2;
      } else {
        return move(operand, operandInd);
      }
    }

    return ind;
  };

  for (let i = 0; i < pr.length; ) {
    const instr = pr[i];
    const input = pr[i + 1];

    switch (instr) {
      case 0: {
        a = input;

        i = move(instr, i);
        break;
      }
      case 1: {
        console.log(a);

        i = move(instr, i);
        break;
      }
      case 2: {
        const conditionIsTrue = a === 0;
        const hasMultipleInstructions = Array.isArray(input);

        if (conditionIsTrue) {
          if (hasMultipleInstructions) {
            return interpreter(input);
          } else {
            i++;
          }
        } else if (!conditionIsTrue) {
          i = move(instr, i);
        }

        break;
      }
      case 3: {
        return input;
      }
      case 4: {
        a--;

        i = move(instr, i);
        break;
      }
      case 5: {
        i = input;
        break;
      }
      case 6: {
        console.log("test");

        i = move(instr, i);
        break;
      }
      case 7: {
        const conditionIsTrue = a % 2 === 0;
        const hasMultipleInstructions = Array.isArray(input);

        if (conditionIsTrue) {
          if (hasMultipleInstructions) {
            return interpreter(input);
          } else {
            i++;
          }
        } else if (!conditionIsTrue) {
          i = move(instr, i);
        }

        break;
      }
    }
  }
};

interpreter(program);
