import { buildOzReducer } from "./oz-reducer";

describe("empty reducer", () => {
  const [reducer, actions] = buildOzReducer({});

  it("should have only reset!!!", () => {
    expect(Object.keys(actions)).toHaveLength(0);
  });

  it("should have return state if no action was matched", () => {
    const state = { a: 1 };
    // next line need this flag, because it's compile time error
    // @ts-expect-error
    expect(reducer(state, { type: "" })).toBe(state);
  });
});

describe("Check initial state", () => {
  const [reducer, actions] = buildOzReducer({
    a: 1,
    b: "abc"
  });

  it("should return initial state", () => {
    // next line need this flag, because it's compile time error
    // @ts-expect-error
    expect(reducer(undefined, { type: "" })).toEqual({ a: 1, b: "abc" });
  });
});

describe("Check simple actions", () => {
  const [reducer, actions] = buildOzReducer({
    sum: 0,
    add(state: any, toAdd: number) {
      return { ...state, sum: state.sum + toAdd };
    },

    async testAsync(state: any) {
      return await state;
    }
  });

  it("should add a value", () => {
    expect(reducer(undefined, actions.add(123))).toEqual({ sum: 123 });
  });

  it("should have two actions besides reset !!!", () => {
    expect(Object.keys(actions)).toHaveLength(2);
  });
});

describe("Check state", () => {
  const [reducer, actions] = buildOzReducer({
    sum: 0,
    add(state: any, toAdd: number) {
      return { ...state, sum: state.sum + toAdd };
    }
  });

  const state0 = reducer(undefined, actions.add(0));
  expect(state0.sum).toBe(0);
  const state1 = reducer(state0, actions.add(2));
  expect(state1.sum).toBe(2);
  const state2 = reducer(state1, actions.add(-1));
  expect(state2.sum).toEqual(1);
});
