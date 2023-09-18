import { Dispatch } from "redux";
import { ExcludeType, ExtractKeys, ExtractType, Without } from "./infra-types";
export type ActionTypeKeys<T> = ExtractKeys<T, Function>;
export interface ActionPayload<T> {
    type: ActionTypeKeys<T>;
    payload?: T[keyof T];
}
export type CallbacksType<T> = ExtractType<T, (...args: any[]) => void>;
export type StateType<T> = ExcludeType<T, (...args: any[]) => void>;
export type GetState<T> = () => StateType<T>;
interface IResetStateAction {
    resetState(): ActionPayload<void>;
}
export interface IResetState<T> {
    resetState(): StateType<T>;
}
export declare class ResetState<T> implements IResetState<T> {
    resetState: () => StateType<T>;
    constructor(initialState: StateType<T>);
}
export type ActionsType<T> = Without<{
    [Property in keyof T]: T[Property] extends (state: StateType<T>) => void ? () => ActionPayload<T> : T[Property] extends (state: StateType<T>, payload: any) => void ? (payload: Parameters<T[Property]>[1]) => ActionPayload<T> : T[Property] extends (dispatch: Dispatch) => Promise<void> ? () => ActionPayload<T> : T[Property] extends (dispatch: Dispatch, getState: GetState<T>) => Promise<void> ? () => ActionPayload<T> : T[Property] extends (dispatch: Dispatch, getState: GetState<T>, extraArgument: any) => Promise<void> ? () => ActionPayload<T> : T[Property] extends (dispatch: Dispatch, getState: GetState<T>, extraArgument: any, payload: infer PayloadType) => Promise<void> ? (payload: PayloadType) => ActionPayload<T> : never;
}, never> & IResetStateAction;
export type Reducer<T> = (state: StateType<T> | undefined, { type, payload }: ActionPayload<T>) => StateType<T>;
export {};
