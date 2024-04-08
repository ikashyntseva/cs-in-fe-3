export class Link<T> {
  value: T;
  next: Link<T> | null = null;
  prev: Link<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}
