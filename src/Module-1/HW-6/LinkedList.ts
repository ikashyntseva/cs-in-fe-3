import { Link } from "./Link";

export class LinkedList<T> {
  first: Link<T> | null = null;
  last: Link<T> | null = null;

  get isEmpty() {
    return this.first === null && this.last === null;
  }

  push(value: T) {
    const link = new Link(value);

    if (this.isEmpty) {
      this.first = link;
      this.last = link;
    } else {
      link.prev = this.last;
      (this.last as Link<T>).next = link;
      this.last = link;
    }
  }

  pop() {
    if (!this.isEmpty) {
      const oldLast = this.last as Link<T>;
      const newLast = oldLast?.prev;

      if (newLast) {
        newLast.next = null;
      }

      this.last = newLast;

      return oldLast.value;
    }
  }

  unshift(value: T) {
    const link = new Link(value);

    if (this.isEmpty) {
      this.first = link;
      this.last = link;
    } else {
      link.next = this.first;
      (this.first as Link<T>).prev = link;
      this.first = link;
    }
  }

  shift() {
    if (!this.isEmpty) {
      const oldFirst = this.first as Link<T>;
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
