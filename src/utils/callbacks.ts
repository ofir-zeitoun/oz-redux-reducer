import { Reducer } from ".";
import { AsyncFunction } from "./consts";

const isAsync = (func: Function) => func.constructor.name === AsyncFunction.name;

export const buildCallback =
  <T, U extends keyof Reducer<T>>(key: U) =>
  (obj: Reducer<T>) => {
    const func = obj[key] as Function;
    return isAsync(func)
      ? (payload: any) => (dispatch: Function, getState: Function, extraArgument: any) =>
          func.bind(obj)(dispatch, getState, extraArgument, payload)
      : (payload: any) => ({ type: key, payload });
  };
