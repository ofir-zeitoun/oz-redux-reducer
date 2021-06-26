export type Constructor<T = {}> = new (...args: any[]) => T;

export interface Payload<T, P> {
  type: keyof Reducer<T>;
  payload: P;
}

export interface IResetState {
  resetState: () => void;
}

export type Actions<Type> = {
  [Property in keyof Type]: (payload: any) => void;
};

export interface Reducer<T> {
  reducer: Function;
  actions: Actions<T> & IResetState;
  initialState: object;
}
