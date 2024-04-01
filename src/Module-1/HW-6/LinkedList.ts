import { Link } from "./Link";

export class LinkedList {
  first: Link | null;
  last: Link | null;

  constructor() {
    this.first = null;
    this.last = null;
  }

  get isEmpty() {
    return this.first === null;
  }

  push(value: number) {
    const link = new Link(value);

    if (this.isEmpty) {
      this.first = link;
      this.last = link;
    } else {
      const oldLast = this.last as Link;

      oldLast.next = link;

      link.prev = oldLast;

      this.last = link;
    }
  }

  pop() {
    if (!this.isEmpty) {
      const oldLast = this.last as Link;
      const newLast = oldLast?.prev;

      if (newLast) {
        newLast.next = null;
      }

      this.last = newLast;

      return oldLast.value;
    }
  }

  unshift(value: number) {
    const link = new Link(value);

    if (this.isEmpty) {
      this.first = link;
      this.last = link;
    } else {
      const oldFirst = this.first as Link;

      oldFirst.prev = link;

      link.next = oldFirst;

      this.first = link;
    }
  }

  shift() {
    if (!this.isEmpty) {
      const oldFirst = this.first as Link;
      const newFirst = oldFirst?.next;

      if (newFirst) {
        newFirst.prev = null;
      }

      this.first = newFirst;

      return oldFirst.value;
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
