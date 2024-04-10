export class Memory {
  buffer;
  #view;

  constructor(TypedArrayConstructor, capacity, relocatedBuffer) {
    const byteLength = capacity * TypedArrayConstructor.BYTES_PER_ELEMENT;

    this.buffer = !relocatedBuffer
      ? new ArrayBuffer(byteLength)
      : relocatedBuffer.transfer(byteLength);
    this.#view = new TypedArrayConstructor(this.buffer);
  }

  get(ind) {
    return this.#view[ind];
  }

  set(value, ind = 0) {
    this.#view[ind] = value;
  }
}
