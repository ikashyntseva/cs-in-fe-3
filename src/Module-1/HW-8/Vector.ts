import { Memory } from "./Memory";

type TypedArrayConstructor =
  | Int8ArrayConstructor
  | Uint8ArrayConstructor
  | Uint8ClampedArrayConstructor
  | Int16ArrayConstructor
  | Uint16ArrayConstructor
  | Int32ArrayConstructor
  | Uint32ArrayConstructor
  | Float32ArrayConstructor
  | Float64ArrayConstructor
  | BigInt64ArrayConstructor
  | BigUint64ArrayConstructor;

export class Vector {
  length = 0;
  capacity;

  private TypedArrayConstructor;
  private memory;

  constructor(
    TypedArrayConstructor: TypedArrayConstructor,
    { capacity = 10 }: { capacity: number }
  ) {
    this.TypedArrayConstructor = TypedArrayConstructor;
    this.memory = new Memory(TypedArrayConstructor, capacity);
    this.capacity = capacity;
  }

  get buffer() {
    return this.memory.buffer;
  }

  get isFull() {
    return this.length + 1 > this.capacity;
  }

  protected resize(newCapacity = this.length * 2) {
    this.memory = new Memory(
      this.TypedArrayConstructor,
      newCapacity,
      this.buffer
    );
    this.capacity = newCapacity;
  }

  // move function v2.1
  protected move(toInd: number = 0, remove = false) {
    let value;

    if (!remove) {
      for (let i = this.length - 1; i >= toInd; i--) {
        value = this.get(i);

        this.memory.set(value, i + 1);
      }
    } else {
      for (let i = toInd; i < this.length; i++) {
        value = this.get(i + 1);

        this.memory.set(value, i);
      }
    }
  }

  // move function v2.0
  // protected move(ind: number = 0, remove = false) {
  //   const getMoveData = (i?: number) => {
  //     if (i !== undefined) {
  //       let getInd = i;
  //       let setInd = i + 1;

  //       if (remove) {
  //         getInd = setInd;
  //         setInd -= 1;
  //       }

  //       return {
  //         getInd,
  //         setInd,
  //       };
  //     } else {
  //       let start = this.length - 1;
  //       let end = ind;

  //       if (remove) {
  //         start = end;
  //         end = this.length;
  //       }

  //       return {
  //         start,
  //         end,
  //       };
  //     }
  //   };

  //   const { start, end } = getMoveData() as {
  //     start: number;
  //     end: number;
  //   };

  //   for (let i = start; remove ? i < end : i >= end; remove ? i++ : i--) {
  //     const { getInd, setInd } = getMoveData(i) as {
  //       getInd: number;
  //       setInd: number;
  //     };

  //     const value = this.get(getInd);

  //     this.memory.set(value, setInd);
  //   }
  // }

  // move function v1.0
  // protected move(toInd: number = 0) {
  //   for (let i = this.length - 1; i >= toInd; i--) {
  //     const value = this.get(i);

  //     this.memory.set(value, i + 1);
  //   }
  // }

  // delete function v1.0
  // delete(ind: number = 0) {
  //   const value = this.get(ind);

  //   for (let i = ind; i < this.length; i++) {
  //     const value = this.get(i + 1);

  //     this.memory.set(value, i);
  //   }

  //   this.length--;

  //   return value;
  // }

  // delete function v2.0
  delete(ind: number = 0) {
    const value = this.get(ind);

    this.move(ind, true);

    this.length--;

    return value;
  }

  get(ind: number) {
    return this.memory.get(ind);
  }

  set(value: number, ind: number) {
    this.move(ind);

    this.memory.set(value, ind);
  }

  unshift(value: number) {
    this.move();
    this.memory.set(value);
    this.length++;

    return this.length;
  }

  shift() {
    return this.delete();
  }

  push(value: number) {
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
