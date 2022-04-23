# oz-redux-reducer

This utility reduces the boilerplate for [Redux](https://redux.js.org/ "Official site") store reducers.

In one function you will have both the reducer and the actions without the need for types.

No more switch cases
No more types

Works with:

1. [Redux](https://redux.js.org/ "Official site")
1. [Redux Thunk](https://www.npmjs.com/package/redux-thunk "npm")
1. [React Redux](https://www.npmjs.com/package/react-redux "npm")

## Install:

```
npm i oz-redux-reducer
```

## Usage:

```ts
import { buildOzReducer } from "oz-redux-reducer";
// .
// .
// .
export const [testReducer, testActions] = buildOzReducer({
  text: "test",
  setText(state: object, newValue: string) {
    return { ...state, text: newValue };
  }
});
```

in reducers file:

```js
import { combineReducers } from "redux";

// ...
import { testReducer } from "./TestReducer";
// ...

export default combineReducers({
  // ...
  test: testReducer
  // ...
});
```

calling actions:

```js
import { testActions } from "./TestReducer";

// ...
dispatch(testActions.setText("newText"));
```

### Now replace old reducers with new ozReducer 😉
