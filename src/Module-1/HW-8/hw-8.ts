import { Vector } from "./Vector";

// Реализовать универсальный класс вектора для всех типизированных массивов

let vec = new Vector(Int32Array, { capacity: 4 });

vec.push(1); // Возвращает длину - 1
vec.push(2); // 2
vec.push(3); // 3
vec.push(4); // 4
vec.push(5); // 5 Увеличение буфера

console.log(vec.capacity); // 8
console.log(vec.length); // 5

vec.pop(); // Удаляет с конца, возвращает удаленный элемент - 5

console.log(vec.capacity); // 8

vec.shrinkToFit(); // Новая емкость 4
console.log(vec.capacity); // 4

console.log(vec.buffer); // Ссылка на ArrayBuffer

// Реализовать итератор values для вектора с учетом того, что буфер может вырасти

vec = new Vector(Int32Array, { capacity: 1 });

const i = vec.values();

vec.push(1);
vec.push(2);
vec.push(3);

console.log(i.next()); // {done: false, value: 1}
console.log(i.next()); // {done: false, value: 2}
console.log(i.next()); // {done: false, value: 3}
console.log(i.next()); // {done: true, value: undefined}
