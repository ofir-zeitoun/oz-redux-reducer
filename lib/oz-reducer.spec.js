"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const oz_reducer_1 = require("./oz-reducer");
describe("empty reducer", () => {
    let Empty = class Empty {
    };
    Empty = __decorate([
        oz_reducer_1.ozReducer
    ], Empty);
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
    let InitialState = class InitialState {
        constructor() {
            this.a = 1;
            this.b = "abc";
        }
    };
    __decorate([
        oz_reducer_1.initial
    ], InitialState.prototype, "a", void 0);
    __decorate([
        oz_reducer_1.initial
    ], InitialState.prototype, "b", void 0);
    InitialState = __decorate([
        oz_reducer_1.ozReducer
    ], InitialState);
    const initState = new InitialState();
    it("should return initial state", () => {
        const state = initState.reducer(undefined, { type: "test", payload: 123 });
        expect(state).toEqual({ a: 1, b: "abc" });
    });
});
describe("Check simple actions", () => {
    let SimpleActions = class SimpleActions {
        constructor() {
            this.sum = 0;
        }
        add(state, toAdd) {
            return { ...state, sum: state.sum + toAdd };
        }
        async testAsync(state) {
            await (() => { })();
        }
    };
    __decorate([
        oz_reducer_1.initial
    ], SimpleActions.prototype, "sum", void 0);
    __decorate([
        oz_reducer_1.action
    ], SimpleActions.prototype, "add", null);
    __decorate([
        oz_reducer_1.action
    ], SimpleActions.prototype, "testAsync", null);
    SimpleActions = __decorate([
        oz_reducer_1.ozReducer
    ], SimpleActions);
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
    let TestState = class TestState {
        constructor() {
            this.sum = 0;
        }
        add(state, toAdd) {
            return { ...state, sum: state.sum + toAdd };
        }
    };
    __decorate([
        oz_reducer_1.initial
    ], TestState.prototype, "sum", void 0);
    __decorate([
        oz_reducer_1.action
    ], TestState.prototype, "add", null);
    TestState = __decorate([
        oz_reducer_1.ozReducer
    ], TestState);
    const { actions, reducer } = new TestState();
    const state0 = reducer(undefined, actions.resetState());
    expect(state0.sum).toBe(0);
    const state1 = reducer(state0, actions.add(2));
    expect(state1.sum).toBe(2);
    const state2 = reducer(state0, actions.resetState());
    expect(state2).toEqual(state0);
});
