"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector = void 0;
const Memory_1 = require("./Memory");
class Vector {
    length = 0;
    capacity;
    TypedArrayConstructor;
    memory;
    constructor(TypedArrayConstructor, { capacity = 10 }) {
        this.TypedArrayConstructor = TypedArrayConstructor;
        this.memory = new Memory_1.Memory(TypedArrayConstructor, capacity);
        this.capacity = capacity;
    }
    get buffer() {
        return this.memory.buffer;
    }
    get isFull() {
        return this.length + 1 > this.capacity;
    }
    resize(newCapacity = this.length * 2) {
        this.memory = new Memory_1.Memory(this.TypedArrayConstructor, newCapacity, this.buffer);
        this.capacity = newCapacity;
    }
    move(toInd = 0, remove = false) {
        let value;
        if (!remove) {
            for (let i = this.length - 1; i >= toInd; i--) {
                value = this.get(i);
                this.memory.set(value, i + 1);
            }
        }
        else {
            for (let i = toInd; i < this.length; i++) {
                value = this.get(i + 1);
                this.memory.set(value, i);
            }
        }
    }
    delete(ind = 0) {
        const value = this.get(ind);
        this.move(ind, true);
        this.length--;
        return value;
    }
    get(ind) {
        return this.memory.get(ind);
    }
    set(value, ind) {
        this.move(ind);
        this.memory.set(value, ind);
    }
    unshift(value) {
        this.move();
        this.memory.set(value);
        this.length++;
        return this.length;
    }
    shift() {
        return this.delete();
    }
    push(value) {
        if (this.isFull) {
            this.resize();
        }
        this.memory.set(value, this.length);
        this.length++;
        return this.length;
    }
    pop() {
        return this.delete(this.length - 1);
    }
    shrinkToFit() {
        this.resize(this.length);
        this.capacity = this.length;
    }
    *values() {
        let i = 0;
        while (i < this.length - 1) {
            yield this.get(i++);
        }
    }
}
exports.Vector = Vector;
