// export interface IResetState {
//   resetState: () => void;
// }

import { ExcludeType, ExtractKeys, ExtractType, Without } from "./infra-types";

type ActionTypeKeys<T> = ExtractKeys<T, Function>;

export interface ActionPayload<T> {
  type: ActionTypeKeys<T>;
  payload?: T[keyof T];
}

// ↓↓↓↓↓ interesting ↓↓↓↓↓↓↓
export type ActionsType<T> = Without<
  {
    [Property in keyof T]: T[Property] extends (state: object) => void
      ? () => ActionPayload<T> // no params
      : T[Property] extends (state: object, payload: any) => void
      ? (payload: Parameters<T[Property]>[1]) => ActionPayload<T> // with params
      : T[Property] extends (dispatch: Function) => Promise<void>
      ? () => ActionPayload<T> // no params
      : T[Property] extends (dispatch: Function, getState: Function) => Promise<void>
      ? () => ActionPayload<T> // no params
      : T[Property] extends (
          dispatch: Function,
          getState: Function,
          extraArgument: any
        ) => Promise<void>
      ? () => ActionPayload<T> // no params
      : T[Property] extends (
          dispatch: Function,
          getState: Function,
          extraArgument: any,
          payload: infer PayloadType
        ) => Promise<void>
      ? (payload: PayloadType) => ActionPayload<T>
      : never;
  },
  never
>;

export type CallbacksType<T> = ExtractType<T, (...args: any[]) => void>;

export type StateType<T> = ExcludeType<T, (...args: any[]) => void>;

export type Reducer<T> = (
  state: StateType<T> | undefined,
  { type, payload }: ActionPayload<T>
) => StateType<T>;
