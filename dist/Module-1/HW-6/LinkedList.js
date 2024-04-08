"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkedList = void 0;
const Link_1 = require("./Link");
class LinkedList {
    first;
    last;
    constructor() {
        this.first = null;
        this.last = null;
    }
    get isEmpty() {
        return this.first === null;
    }
    add(value) {
        const link = new Link_1.Link(value);
        if (this.isEmpty) {
            this.first = link;
            this.last = link;
        }
        else {
            const prev = this.last;
            prev.next = link;
            link.prev = prev;
            this.last = link;
        }
    }
    remove() {
        if (!this.isEmpty) {
            const oldLast = this.last;
            const newLast = oldLast?.prev;
            if (newLast) {
                newLast.next = null;
            }
            this.last = newLast;
            return oldLast.value;
        }
    }
    clear() {
        this.first = null;
        this.last = null;
    }
    *[Symbol.iterator]() {
        let current = this.first;
        while (current) {
            const { value, next } = current;
            yield value;
            current = next;
        }
    }
}
exports.LinkedList = LinkedList;
const list = new LinkedList();
list.add(1);
list.add(2);
list.add(3);
list.add(4);
list.clear();
console.log(list.isEmpty);
