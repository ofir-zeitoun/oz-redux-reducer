# @oz-utils/redux-reducer

This utility reduces the boilerplate for [Redux](https://redux.js.org/ "Official site") store reducers.

In one function you will have both the reducer and the actions without the need for types.

No more switch cases

No more types

Works with:

1. [Redux](https://redux.js.org/ "Official site")
1. [Redux Thunk](https://www.npmjs.com/package/redux-thunk "npm")
1. [React Redux](https://www.npmjs.com/package/react-redux "npm")

## Example:

[Live demo](https://ofir-zeitoun.github.io/oz-redux-reducer/)

## Install:

```
npm i @oz-utils/redux-reducer
```

## Usage:

`./src/store/reducers/demo-reducer.ts`

```ts
import { Dispatch } from "redux";
import { buildReducer } from "@oz-utils/redux-reducer";

export const [demoReducer, demoActions] = buildReducer({
  // initial state
  text: "<some init value>s",

  // actions
  setText(state: object, newValue: string) {
    return { ...state, text: newValue };
  },

  async fetchText(dispatch: Dispatch) {
    const value = await fetch(/*...*/);
    dispatch(demoActions.setText(value));
  };
});
```

`.src/store/actions.ts`

```ts
export { demoActions } from "./reducers/demo-reducer.ts
```

`./src/store/reducers/index.ts`

```ts
import { combineReducers } from "redux";
import { demoReducer } from "./demo-reducer";

export default combineReducers({
  demo: demoReducer,
});
```

calling actions:

```ts
import { demoActions } from "./demo-reducer";

// in compnent or hook
dispatch(demoActions.setText("newText"));
```

### Now replace old reducers with new ozReducer 😉
