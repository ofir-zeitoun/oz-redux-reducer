import { buildOzReducer } from "oz-redux-reducer";

export const [testReducer, testActions] = buildOzReducer({
  sum: 0,
  word: "<Empty>",
  prev: "<Empty>",
  add(state: any, toAdd: number) {
    return {
      ...state,
      sum: state.sum + toAdd
    };
  },
  reset(state: any) {
    return { ...state, sum: 0 };
  },
  setSum(state: any, sum: number) {
    return { ...state, sum };
  },
  async fetchRandom(dispatch: Function) {
    const value = await fetch(
      "https://www.random.org/integers/?num=1&min=1&max=100&col=1&base=10&format=plain&rnd=new"
    ).then(response => response.json());
    dispatch(testActions.setSum(value));
  },
  setWord(state: any, { word, prev }: { word: string; prev?: string }) {
    return { ...state, prev, word };
  },
  async fetchWord(dispatch: Function, getState: Function, extraArgument: any, payload: string) {
    const word = await fetch(
      "https://www.random.org/strings/?num=1&len=10&digits=on&upperalpha=on&loweralpha=on&format=plain&rnd=new"
    ).then(response => response.text());

    dispatch(testActions.setWord({ word, prev: payload }));
  }
});
