export declare const buildCallback: <T extends object, U extends keyof T>(key: U) => (obj: T) => ((payload: any) => (dispatch: Function, getState: Function, extraArgument: any) => any) | ((payload: any) => {
    type: U;
    payload: any;
});
