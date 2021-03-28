# oz-redux-reducer

This utility reduces the boilerplate for [Redux](https://redux.js.org/ "Official site") store reducers.

In one class you will have both the reducer and the actions without the need for types.

No more switch cases
No more types

Works with:

1. [Redux](https://redux.js.org/ "Official site")
1. [Redux Thunk](https://www.npmjs.com/package/redux-thunk "npm")
1. [React Redux](https://www.npmjs.com/package/react-redux "npm")

Usage:

```ts
@ozReducer
class TestReducer {
  @initial
  someValue: string = "test"; // this goes to initial state

  @action
  actionA = async (dispatch: Function) => {
    // do something
    dispatch(this.actions.actionB(111));
  };

  @action
  actionB = <T extends object>(state: T, item: any) => ({ ...state, item });

  @action
  actionC<T extends object>(state: T, item: any): T {
    return { ...state, item };
  }
}

interface TestReducer extends Reducer<TestReducer> {}

export default new TestReducer();
```

in reducers file:

```js
import { combineReducers } from "redux";

// ...
import test from "./TestReducer";
// ...

export default combineReducers({
  // ...
  test: test.reducer
  // ...
});
```
