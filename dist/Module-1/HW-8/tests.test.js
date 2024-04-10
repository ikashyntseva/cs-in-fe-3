"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Vector_1 = require("./Vector");
describe("Vector", () => {
    let vec;
    beforeEach(() => {
        vec = new Vector_1.Vector(Int32Array, { capacity: 4 });
    });
    test("Should insert element at the beginning and return correct length", () => {
        vec.push(1);
        vec.push(2);
        vec.push(3);
        const oldLength = vec.length;
        expect(vec.unshift(0)).toBe(oldLength + 1);
        const values = vec.values();
        let i = vec.get(0);
        let result = values.next();
        while (result.value) {
            expect(result.value).toBe(i);
            result = values.next();
            i++;
        }
    });
    test("Should remove first element and return it", () => {
        vec.push(1);
        vec.push(2);
        vec.push(3);
        const firstElement = vec.get(0);
        const oldLength = vec.length;
        expect(vec.shift()).toBe(firstElement);
        expect(vec.length).toBe(oldLength - 1);
        const values = vec.values();
        let i = vec.get(0);
        let result = values.next();
        while (result.value) {
            expect(result.value).toBe(i);
            result = values.next();
            i++;
        }
    });
    test("Should insert element at the end and return correct length", () => {
        vec.push(1);
        vec.push(2);
        vec.push(3);
        vec.push(4);
        expect(vec.get(vec.length - 1)).toBe(4);
        expect(vec.length).toBe(4);
    });
    test("Should remove the last element and return it", () => {
        vec.push(1);
        vec.push(2);
        vec.push(3);
        vec.push(4);
        const oldLength = vec.length;
        expect(vec.pop()).toBe(4);
        expect(vec.get(vec.length)).toBe(0);
        expect(vec.length).toBe(oldLength - 1);
    });
    test("Should get element by index", () => {
        vec.push(1);
        vec.push(2);
        vec.push(3);
        vec.push(4);
        expect(vec.get(1)).toBe(2);
    });
    test("Should set element by index", () => {
        vec.push(1);
        vec.push(2);
        vec.push(4);
        vec.set(3, 2);
        expect(vec.get(2)).toBe(3);
        expect(vec.get(3)).toBe(4);
    });
    test("Should remove element by index", () => {
        vec.push(1);
        vec.push(2);
        vec.push(3);
        vec.push(4);
        expect(vec.delete(1)).toBe(2);
        expect(vec.get(1)).toBe(3);
    });
    test.skip("Should increase capacity when vector is full", () => {
        vec.push(1);
        vec.push(2);
        vec.push(3);
        vec.push(4);
        const oldLength = vec.length;
        vec.push(5);
        expect(vec.capacity).toBe(oldLength * 2);
        expect(vec.length).toBe(oldLength + 1);
    });
    test.skip("Should shrink to fit properly", () => {
        const vec = new Vector_1.Vector(Int32Array, { capacity: 8 });
        vec.push(1);
        vec.push(2);
        vec.push(3);
        vec.push(4);
        vec.shrinkToFit();
        expect(vec.capacity).toBe(vec.length);
    });
    test("Should have correctly working iterator values", () => {
        const values = vec.values();
        vec.push(1);
        vec.push(2);
        vec.push(3);
        vec.push(4);
        let i = vec.get(0);
        let result = values.next();
        while (result.value) {
            expect(result.value).toBe(i);
            result = values.next();
            i++;
        }
    });
});
