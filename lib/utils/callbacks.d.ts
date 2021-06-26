import { Reducer } from ".";

export declare const buildCallback: <T, U extends keyof Reducer<T>>(
  key: U
) => (obj: Reducer<T>) =>
  | ((payload: any) => (dispatch: Function, getState: Function, extraArgument: any) => any)
  | ((payload: any) => {
      type: U;
      payload: any;
    });
