"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oz_reducer_1 = require("./oz-reducer");
describe("empty reducer", () => {
    const [reducer, actions] = (0, oz_reducer_1.buildOzReducer)({});
    it("should have only reset!!!", () => {
        expect(Object.keys(actions)).toHaveLength(1);
    });
    it("should have return state if no action was matched", () => {
        const state = { a: 1 };
        expect(reducer(state, { type: "" })).toBe(state);
    });
});
describe("Check initial state", () => {
    const [reducer, actions] = (0, oz_reducer_1.buildOzReducer)({
        a: 1,
        b: "abc"
    });
    it("should return initial state", () => {
        expect(reducer(undefined, { type: "" })).toEqual({ a: 1, b: "abc" });
    });
});
describe("Check simple actions", () => {
    const [reducer, actions] = (0, oz_reducer_1.buildOzReducer)({
        sum: 0,
        add(state, toAdd) {
            return { ...state, sum: state.sum + toAdd };
        },
        async testAsync(state) {
            return await state;
        }
    });
    it("should add a value", () => {
        expect(reducer(undefined, actions.add(123))).toEqual({ sum: 123 });
    });
    it("should have two actions besides reset !!!", () => {
        expect(Object.keys(actions)).toHaveLength(3);
    });
});
describe("Check state", () => {
    const [reducer, actions] = (0, oz_reducer_1.buildOzReducer)({
        sum: 0,
        add(state, toAdd) {
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
