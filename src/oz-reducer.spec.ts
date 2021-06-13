import { action, initial, ozReducer } from "./oz-reducer";
import { Reducer } from "./utils";

describe("empty reducer", () => {
  @ozReducer
  class Empty {}
  interface Empty extends Reducer<Empty> {}

  const empty = new Empty();

  it("should have only reset", () => {
    expect(empty).toHaveProperty("actions");
    expect(Object.keys(empty.actions)).toHaveLength(1);
  });

  it("should have return state if no action was matched", () => {
    expect(empty).toHaveProperty("reducer");
    const state = { a: 1 };
    expect(empty.reducer(state, { type: "test", payload: 123 })).toBe(state);
  });
});

describe("Check initial state", () => {
  @ozReducer
  class InitialState {
    @initial
    a: number = 1;
    @initial
    b: string = "abc";
  }

  interface InitialState extends Reducer<InitialState> {}

  const initState = new InitialState();

  it("should return initial state", () => {
    const state = initState.reducer(undefined, { type: "test", payload: 123 });
    expect(state).toEqual({ a: 1, b: "abc" });
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

    @action
    async testAsync(state: any) {
      await (() => {})();
    }
  }

  interface SimpleActions extends Reducer<SimpleActions> {}

  const simple = new SimpleActions();

  it("should add a value", () => {
    const addType = simple.actions.add(123);
    expect(simple.reducer(undefined, addType)).toEqual({ sum: 123 });
  });

  it("should have two actions besides reset", () => {
    expect(Object.keys(simple.actions)).toHaveLength(3);
  });
});

describe("Check state", () => {
  @ozReducer
  class TestState {
    @initial
    sum: number = 0;

    @action
    add(state: any, toAdd: number) {
      return { ...state, sum: state.sum + toAdd };
    }
  }

  interface TestState extends Reducer<TestState> {}
  const { actions, reducer } = new TestState();

  const state0 = reducer(undefined, actions.resetState());
  expect(state0.sum).toBe(0);
  const state1 = reducer(state0, actions.add(2));
  expect(state1.sum).toBe(2);
  const state2 = reducer(state0, actions.resetState());
  expect(state2).toEqual(state0);
});
