"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LinkedList_1 = require("./LinkedList");
describe("LinkedList", () => {
    const list = new LinkedList_1.LinkedList();
    test("Should be empty when is being created", () => {
        expect(list.isEmpty).toBeTruthy();
    });
    test("The first and the last should be the same when there is only one element in the list", () => {
        list.add(1);
        expect(list.first?.value).toBe(list.last?.value);
    });
    test("The first should contain link to the next element in the list", () => {
        list.add(2);
        expect(list.first?.next?.value).toBe(2);
    });
    test("The next element should contain link to the previous element in the list", () => {
        expect(list.first?.next?.prev?.value).toBe(1);
    });
    test("The last should contain link to the last added to the list element", () => {
        list.add(3);
        expect(list.last?.value).toBe(3);
    });
    test("The list should be iterable", () => {
        for (let el = 4; el <= 6; el++) {
            list.add(el);
        }
        let i = list.first?.value;
        for (const value of list) {
            expect(value).toBe(i);
            i++;
        }
    });
    test("Method remove should remove the last element of the list and return it if the list is not empty", () => {
        list.add(7);
        expect(list.remove()).toBe(7);
    });
    test("Method clear should remove all the elements if the list is list empty", () => {
        list.clear();
        expect(list.isEmpty).toBeTruthy();
    });
    test("Method remove should should do nothing if the list is  empty", () => {
        expect(list.remove()).not.toBeDefined();
    });
});
