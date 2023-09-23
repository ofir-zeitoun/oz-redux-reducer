import { ActionsType, Reducer } from "./utils";
export declare function buildReducer<T extends {
    [s: string]: unknown;
}>(obj: T): [Reducer<T>, ActionsType<T>];
