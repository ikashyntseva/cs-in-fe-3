export class Link {
  value: number;
  next: Link | null;
  prev: Link | null;

  constructor(value: number) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}
