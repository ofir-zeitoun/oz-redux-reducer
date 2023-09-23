import { buildReducer } from "@oz-utils/redux-reducer";
import { Dispatch } from "redux";

type Init = {
  sum: number;
  word: string;
  prev: string;
};

export const [testReducer, testActions] = buildReducer({
  sum: 0,
  word: "<Empty>",
  prev: "<Empty>",
  add(state: Init, toAdd: number) {
    return {
      ...state,
      sum: state.sum + toAdd,
    };
  },
  resetSum(state: Init) {
    return { ...state, sum: 0 };
  },
  setSum(state: Init, sum: number) {
    return { ...state, sum };
  },
  async fetchRandom(dispatch: Dispatch) {
    const value = await fetch(
      "https://www.random.org/integers/?num=1&min=1&max=100&col=1&base=10&format=plain&rnd=new"
    ).then((response) => response.json());
    dispatch(testActions.setSum(value));
  },
  setWord(state: Init, word: string) {
    return { ...state, prev: state.word, word };
  },
  async fetchWord(
    dispatch: Dispatch,
    getState: () => Init,
    extraArgument: any,
    payload: number
  ) {
    const word = await fetch(
      `https://www.random.org/strings/?num=1&len=${payload}&digits=on&upperalpha=on&loweralpha=on&format=plain&rnd=new`
    ).then((response) => response.text());

    dispatch(testActions.setWord(word.trim()));
  },
});
