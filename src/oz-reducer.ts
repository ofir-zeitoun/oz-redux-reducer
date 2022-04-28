import {
  ActionPayload,
  ActionsType,
  CallbacksType,
  Entry,
  identityFn,
  StateType,
  Reducer,
  ResetState,
  IResetState,
  isFunc,
  isAsync
} from "./utils";

function buildActions<T, TKey extends keyof T>(obj: T): ActionsType<T> {
  const reset = new ResetState({});

  return (Object.entries(obj).concat(Object.entries(reset)) as Entry<T>[])
    .filter(([, func]) => isFunc(func))
    .reduce(
      (a, [key, func]) => ({
        ...a,
        [key]: isAsync(func)
          ? (payload: T[TKey]) => (dispatch: Function, getState: Function, extraArgument: any) =>
              (func as unknown as Function).bind(obj)(dispatch, getState, extraArgument, payload)
          : (payload: T[TKey]) => ({ type: key, payload })
      }),
      {} as ActionsType<T>
    );
}

function buildInitState<T>(obj: T): StateType<T> {
  return (Object.entries(obj) as Entry<T>[])
    .filter(([, func]) => !isFunc(func))
    .reduce((a, [key, value]) => ({ ...a, [key]: value }), {} as StateType<T>);
}

function buildInternalReducer<T>(obj: T): Reducer<T> {
  const initialState = buildInitState(obj);

  const init = new ResetState(initialState);

  const callbacks = (Object.entries(obj).concat(Object.entries(init)) as Entry<T>[])
    .filter(([, func]) => isFunc(func))
    .reduce(
      (a, [key, func]) => ({
        ...a,
        [key]: func
      }),
      init as CallbacksType<T> | IResetState<T>
    );

  const stateReducer = new Proxy(callbacks, {
    get: function (target: any, p: string) {
      return ((target[p] as Function) || identityFn).bind(target);
    }
  });

  return (state = initialState, { type, payload }: ActionPayload<T>) =>
    (stateReducer[type] as Function)(state, payload);
}

export function buildOzReducer<T extends object>(obj: T): [Reducer<T>, ActionsType<T>] {
  const actions = buildActions(obj);
  const reducer = buildInternalReducer(obj);

  return [reducer, actions];
}
