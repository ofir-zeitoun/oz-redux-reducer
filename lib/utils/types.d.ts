export declare type Constructor<T = {}> = new (...args: any[]) => T;
export interface Payload<T> {
    type: string;
    payload: T;
}
export declare type Actions<Type> = {
    [Property in keyof Type]: (payload: any) => void;
};
export interface Reducer<T> {
    reducer: Function;
    actions: Actions<T>;
    initialState: object;
}
