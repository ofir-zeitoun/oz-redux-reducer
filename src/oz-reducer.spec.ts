import { action, initial, ozReducer } from "./oz-reducer";
import { Reducer } from "./utils";

describe('empty reducer', () => {
  @ozReducer
  class Empty {

  }
  interface Empty extends Reducer<Empty> { };

  const empty = new Empty();

  it("should have empty actions", () => {
    expect(empty).toHaveProperty("actions");
    expect(Object.keys(empty.actions)).toHaveLength(0)
  })

  it("should have single equality function", () => {
    expect(empty).toHaveProperty("reducer");
    const state = { a: 1 };
    expect(empty.reducer(state, { type: "test", payload: 123 })).toBe(state)
  })
});

describe("Check initial state", () => {
  @ozReducer
  class InitialState {
    @initial
    a: number = 1;
    @initial
    b: string = "abc"
  }

  interface InitialState extends Reducer<InitialState> { };

  const initState = new InitialState();

  it("should return initial state", () => {
    const state = initState.reducer(undefined, { type: "test", payload: 123 });
    expect(state).toEqual({ a: 1, b: "abc" })
  });
});

describe("Check simple actions", () => {
  @ozReducer
  class SimpleActions {
    @initial
    sum: number = 0;

    @action
    add(state: any, toAdd: number) {
      return { ...state, sum: state.sum + toAdd };
    }
  }

  interface SimpleActions extends Reducer<SimpleActions> { };

  const simple = new SimpleActions();

  it('should add a value', () => {
    const addType = simple.actions.add(123);
    expect(simple.reducer(undefined, addType)).toEqual({ sum: 123 });
  })
});
