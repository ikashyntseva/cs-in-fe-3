import { LinkedList } from "./LinkedList";

describe("Linked list", () => {
  const list = new LinkedList();
  test("Should be empty when is being created", () => {
    expect(list.isEmpty).toBeTruthy();
  });

  describe("LinkedList adding/removing to/from the end", () => {
    test("The first and the last should be the same when there is only one element in the list", () => {
      list.push(1);

      expect(list.first?.value).toBe(list.last?.value);
    });

    test("The first should contain link to the next element in the list", () => {
      list.push(2);

      expect(list.first?.next?.value).toBe(2);
    });

    test("The next element should contain link to the previous element in the list", () => {
      expect(list.first?.next?.prev?.value).toBe(1);
    });

    test("The last should contain link to the last added to the list element", () => {
      list.push(3);

      expect(list.last?.value).toBe(3);
    });

    test("The list should be iterable", () => {
      for (let el = 4; el <= 6; el++) {
        list.push(el);
      }

      let i = list.first?.value as number;

      for (const value of list) {
        expect(value).toBe(i);
        i++;
      }
    });

    test("Method remove should remove the last element of the list and return it if the list is not empty", () => {
      list.push(7);

      expect(list.pop()).toBe(7);
    });
  });

  test("Method clear should remove all the elements if the list is list empty", () => {
    list.clear();

    expect(list.isEmpty).toBeTruthy();
  });

  test("Method remove should should do nothing if the list is  empty", () => {
    expect(list.pop()).not.toBeDefined();
    expect(list.shift()).not.toBeDefined();
  });

  describe("LinkedList adding/removing to/from the start", () => {
    test("The first and the last should be the same when there is only one element in the list", () => {
      list.unshift(1);

      expect(list.first?.value).toBe(list.last?.value);
    });

    test("The first should contain link to the newly added element in the list", () => {
      list.unshift(2);

      expect(list.first?.value).toBe(2);
    });

    test("The next element should contain link to the previous element in the list", () => {
      expect(list.first?.next?.value).toBe(1);
    });

    test("The last should contain link to the firstly added element to the list", () => {
      list.unshift(3);

      expect(list.last?.value).toBe(1);
    });

    test("The list should be iterable", () => {
      for (let el = 4; el <= 6; el++) {
        list.unshift(el);
      }

      let i = list.first?.value as number;

      for (const value of list) {
        expect(value).toBe(i);
        i--;
      }
    });

    test("Method shift should remove the last added element of the list and return it if the list is not empty", () => {
      list.unshift(7);

      expect(list.shift()).toBe(7);
    });
  });
});
