import { action, initial, ozReducer } from "./oz-reducer";
import { Reducer } from "./utils";


// @ozReducer
// class TestReducer {

//   @initial
//   state: string = "test"

//   // @asyncAction
//   @action
//   actionA = async (dispatch: Function) => {
//     // do something
//     dispatch(this.actions.actionB(111));
//   }

//   @action
//   actionB = <T extends object>(state: T, item: any) => ({ ...state, item })

//   @action
//   actionC<T extends object>(state: T, item: any): T {
//     return { ...state, item };
//   }
// }

// interface TestReducer extends Reducer<TestReducer> { };

// const test = new TestReducer();

// console.log(test.reducer.toString());
// console.log(test.actions);
// // const reducer = getReducer(test);
// // console.log('reducer: ', reducer);
// // const actions = getActions(test);
// // console.log('actions: ', actions);

// console.log(test.actions.actionB(1));

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

  it("should have initial state", () => {
    expect(initState.reducer(undefined, { type: "test", payload: 123 })).toEqual({ a: 1, b: "abc" })
  })
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
})