"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Link = void 0;
class Link {
    value;
    next;
    prev;
    constructor(value) {
        this.value = value;
        this.next = null;
        this.prev = null;
    }
}
exports.Link = Link;
