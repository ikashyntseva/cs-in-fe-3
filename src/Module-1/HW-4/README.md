# ДЗ к лекции База#4

## Написать класс, который представляет числа в формате BCD 841

Кодироваться цифры должны внутри чисел JS.
Числа в JS используют по умолчанию формат Double (64 бита), но после применения побитовых операторов усекаются до 32 бит в форматах Int32 ил Uint32.
Значит в одном 32 битном числе 4 байта, а в один байт опмещается два числа в BCD.
Однако, у нас есть еще одно ограничений - кодирование в SMI.
SMI позволяет болеее эффективно представлять в памяти целые числа не превышающие 31 бит.
Значит, фактически, мы можем закодировать только 7 BCD символов в одном JS числе (28 бит).

```typescript
class BCD {
  private numbers: number[] = [];

  // Во избежание переполнение Double чисел на вход используем BigInt
  constructor(num: bigint) {
    // ...
  }

  // Во избежание переполнение Double чисел на выход используем BigInt
  valueOf(): bigint {
    // ...
  }

  // Возвращает разряд BCD числа по заданной позиции.
  // Отрицательная позиция означает разряд "с конца".
  get(pos: number): number {}
}

const n = new BCD(65536n);

console.log(n.valueOf()); // 0b01100101010100110110 или 415030n

console.log(n.get(0)); // 6
console.log(n.get(1)); // 5

console.log(n.get(-1)); // 6
console.log(n.get(-2)); // 3
```

## Добавить поддержку отрицательных чисел

**Алгоритм конвертации BCD в отрицательное число называется "дополнение до 9".**

https://www.youtube.com/watch?v=A_7J-R2mGi4
https://www.youtube.com/watch?v=P0_63-UwCvY
https://madformath.com/calculators/digital-systems/binary-codes/bcd-addition-calculator/bcd-addition-calculator

```typescript
const n = new BCD(-65536);

console.log(n.get(0)); // 6
console.log(n.get(1)); // 3

console.log(n.isNegative); // true
```

## Добавить поддержку сложения и вычитания

**Суммирование чисел в BCD 8421 возможно реализовать следующим алгоритмом:**

1. Сначала преобразуйте каждое десятичное число в его BCD-эквивалент. Для этого необходимо каждую цифру числа перевести в четырехбитное двоичное представление. Например, число 925. В BCD оно будет: 1001 (для 9), 0010 (для 2), и 0101 (для 5).

2. Затем проведите обычное двоичное сложение для каждой пары BCD-чисел, начиная с младшего разряда.

3. Если результат сложения не превысил 9 (в двоичной форме 1001), то ничего не меняется. Это вполне корректное BCD-число.

4. В случае, если результат сложения превышает 9, к промежуточному результату необходимо прибавить 6 (в двоичной форме это 0110). Это связано с тем, что в BCD числа от 10 до 15 не используются. Прибавление 6 обеспечивает сдвиг в старший разряд.

5. Если при сложении был получен перенос в следующий разряд, то его также нужно учесть. Если перенос влечет за собой увеличение значения в старшем разряде более чем до 9, то к этому разряду также прибавляется 6.

6. Повторите эти шаги для каждого последующего разряда, пока не выполните все операции сложения.

**Подробнее про двоичное сложение:**

Алгоритм двоичного сложения с использованием побитовых операторов опирается на две основные операции: побитовое И (`&`) и побитовое ИЛИ / XOR (`^`).

1. Используйте побитовое XOR (`^`) для сложения двух чисел. Это даст вам сумму без учета битов переноса. Интуитивно это можно понять так: если оба бита равны 1, это приводит к сумме 2, которая в двоичном представлении равна 10. Но XOR игнорирует старший бит в этом случае и выдает только младший бит.

2. Используйте побитовое И (`&`) для определения, где будут биты переноса. Эта операция вернет 1 только тогда, когда оба бита равны 1, которые и будут битами переноса.

3. Сдвиньте результат операции И на один разряд влево. Это сдвигает биты переноса в положение, где они будут складываться в следующем разряде.

4. Повторите эти шаги до тех пор, пока не будет битов переноса.

Например, имеем числа 12 (`1100`) и 14 (`1110`):

1. Сумма без переносов: 12 ^ 14 = 2 (0010)
   Биты переноса: 12 & 14 = 12 (1100), сдвиг на один разряд влево = 24 (11000)

2. Сумма без переносов: 2 ^ 24 = 26 (11010)
   Биты переноса: 2 & 24 = 0 (сдвиг на 1 разряд влево необязателен, присутствует перенос)
   Нет битов переноса, прекращаем итерацию, итоговая сумма 26 (11010).

```typescript
const n = new BCD(10);

console.log(n.add(15)); // 0b00100101 или 37

console.log(n.substract(10)); // 0b00000000 или 0

console.log(n.substract(-10)); // 0b00100000 или 32 т.к. минус на минус дал плюс
```

## Добавить поддержку умножения и деления

**Алгоритм умножения выражаем через сложение.**

**Алгоритм деления BCD чисел обеспечивает побитовое деление двух BCD чисел аналогично тому, как мы делаем в десятичной арифметике.**

Вот пример алгоритма деления BCD чисел:

1. Начинаем с наиболее старшего разряда (слева) числа BCD.

2. Проверяем, является ли разряд делителя больше или равным делителю. Если это так, вычитаем делитель из текущего разряда делимого и записываем результат, а также увеличиваем текущее значение частного на единицу.

3. Если текущий разряд делителя меньше делителя, мы просто записываем его в результат и переходим к следующему разряду делимого; в этом случае значение частного не изменяется.

4. После того как мы обработали текущий разряд делимого, мы переходим к следующему разряду справа и повторяем процесс, начиная со шага 2, пока не обработаем все разряды делимого.

```typescript
const n = new BCD(10);

console.log(n.multiply(2)); // 0b00100000 или 32
console.log(n.divide(2)); // 0b00010000 или 16
```