# oz-redux-reducer

This utility reduces the boilerplate for [Redux](https://redux.js.org/ "Official site") store reducers.

In one class you will have both the reducer and the actions without the need for types.

No more switch cases
No more types

Works with:

1. [Redux](https://redux.js.org/ "Official site")
1. [Redux Thunk](https://www.npmjs.com/package/redux-thunk "npm")
1. [React Redux](https://www.npmjs.com/package/react-redux "npm")

Jump to: [How to enable decorators in CRA](#how-to-enable-decorators-in-cra)

## Usage:

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

calling actions:

```js
import test from "./TestReducer";

// ...
dispatch(test.actions.actionB(item));
```

## How to enable decorators in CRA

Copied from [Using Mobx decorators in Create React app v3](https://tombuyse.blog/blog/using-mobx-decorators-in-create-react-app-v3)

To enable decorators in CRA, we will need two dependencies:

- customize-cra: makes sure we can tweak the CRA webpack config
- react-app-rewired: needed by customize-cra, it will leverage this dependency under the hood
  Install these dependencies:

`npm install --dev customize-cra react-app-rewired`

Next step, replace "react-scripts" with "react-app-rewired":

file: _package.json_

```json
# instead of react-scripts start
"start": "react-app-rewired start",
# instead of react-scripts build
"build": "react-app-rewired build"
```

Now we need to add config-overrides.js in the base project to enable the decorator support within CRA.

file: _config-overrides.js_

```javascript
const { addDecoratorsLegacy, useEslintRc, override } = require("customize-cra");

module.exports = override(addDecoratorsLegacy(), useEslintRc("./.eslintrc"));
```

The final step is to make sure that our Eslint support decorators. Add following content to a new .eslintrc file (in the base project folder)

file: _.eslintrc_

```json
{
  "extends": "react-app",
  "parserOptions": {
    "ecmaFeatures": {
      "legacyDecorators": true
    }
  }
}
```

### Now replace old reducers with new ozReducer :-)
