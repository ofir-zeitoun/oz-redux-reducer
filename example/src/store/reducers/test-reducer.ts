import { buildOzReducer } from "oz-redux-reducer";

export const [testReducer, testActions] = buildOzReducer({
  sum: 0,
  add(state: any, toAdd: number) {
    return {
      ...state,
      sum: state.sum + toAdd
    };
  }
});
