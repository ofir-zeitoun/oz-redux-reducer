import { ActionsType, Reducer } from "./utils";
export declare function buildOzReducer<T extends object>(obj: T): [Reducer<T>, ActionsType<T>];
