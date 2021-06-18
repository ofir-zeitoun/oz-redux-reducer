import { AsyncFunction } from "./consts";

const isAsync = (func: Function) => func.constructor.name === AsyncFunction.name;

export const buildCallback =
  <T extends object, U extends keyof T>(key: U) =>
  (obj: T) => {
    const func = obj[key] as unknown as Function;
    return isAsync(func)
      ? (payload: any) => (dispatch: Function, getState: Function, extraArgument: any) =>
          func.bind(obj)(dispatch, getState, extraArgument, payload)
      : (payload: any) => ({ type: key, payload });
  };
