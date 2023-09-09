import { ActionsType, Reducer } from "./utils";
export declare function buildOzReducer<T extends {
    [s: string]: unknown;
}>(obj: T): [Reducer<T>, ActionsType<T>];
