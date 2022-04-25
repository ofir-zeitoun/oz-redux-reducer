import { ExcludeType, ExtractKeys, ExtractType, Without } from "./infra-types";
interface IResetStateAction {
    resetState(): ActionPayload<void>;
}
declare type ActionTypeKeys<T> = ExtractKeys<T, Function>;
export interface ActionPayload<T> {
    type: ActionTypeKeys<T>;
    payload?: T[keyof T];
}
export declare type ActionsType<T> = Without<{
    [Property in keyof T]: T[Property] extends (state: object) => void ? () => ActionPayload<T> : T[Property] extends (state: object, payload: any) => void ? (payload: Parameters<T[Property]>[1]) => ActionPayload<T> : T[Property] extends (dispatch: Function) => Promise<void> ? () => ActionPayload<T> : T[Property] extends (dispatch: Function, getState: Function) => Promise<void> ? () => ActionPayload<T> : T[Property] extends (dispatch: Function, getState: Function, extraArgument: any) => Promise<void> ? () => ActionPayload<T> : T[Property] extends (dispatch: Function, getState: Function, extraArgument: any, payload: infer PayloadType) => Promise<void> ? (payload: PayloadType) => ActionPayload<T> : never;
}, never> & IResetStateAction;
export declare type CallbacksType<T> = ExtractType<T, (...args: any[]) => void>;
export declare type StateType<T> = ExcludeType<T, (...args: any[]) => void>;
export declare type Reducer<T> = (state: StateType<T> | undefined, { type, payload }: ActionPayload<T>) => StateType<T>;
export {};
