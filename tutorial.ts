import { AsyncFunction, identityFn } from "./src/utils";

// https://stackoverflow.com/questions/63447660/typescript-remove-all-properties-with-particular-type
type Without<
  T,
  V,
  WithNevers = {
    [K in keyof T]: Exclude<T[K], undefined> extends V
      ? never
      : T[K] extends Record<string, unknown>
      ? Without<T[K], V>
      : T[K];
  }
> = Pick<
  WithNevers,
  {
    [K in keyof WithNevers]: WithNevers[K] extends never ? never : K;
  }[keyof WithNevers]
>;

type ExtractKeys<T, U> = {
  [Key in keyof T]: T[Key] extends U ? Key : never;
}[keyof T] &
  keyof T;

type ExtractType<T, U> = Pick<T, ExtractKeys<T, U>>;

type ExcludeKeys<T, U> = {
  [Key in keyof T]: T[Key] extends U ? never : Key;
}[keyof T] &
  keyof T;

type ExcludeType<T, U> = Pick<T, ExcludeKeys<T, U>>;

// // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types
// type FunctionPropertyNames<T> = {
//   [K in keyof T]: T[K] extends Function ? K : never;
// }[keyof T];
// type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

// type NonFunctionPropertyNames<T> = {
//   [K in keyof T]: T[K] extends Function ? never : K;
// }[keyof T];
// type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

// type ActionTypeKeys<T> = keyof Without<
//   { [K in keyof T]: T[K] extends Function ? K : never },
//   never
// >;
type ActionTypeKeys<T> = keyof ExtractType<T, Function>;

export interface ActionPayload<T> {
  type: ActionTypeKeys<T>;
  payload?: T[keyof T];
}

// ↓↓↓↓↓ interesting ↓↓↓↓↓↓↓
type CreateActionsType<T> = Without<
  {
    [Property in keyof T]: T[Property] extends (state: object) => void
      ? () => ActionPayload<T> // no params
      : T[Property] extends (state: object, payload: any) => void
      ? (payload: Parameters<T[Property]>[1]) => ActionPayload<T> // with params
      : never;
  },
  never
>;

type CreateReducerType<T> = ExtractType<T, (...args: any[]) => void>;

type InitStateType<T> = ExcludeType<T, (...args: any[]) => void>;

type Entry<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T];

const isAsync = (func: any) => func.constructor.name === AsyncFunction.name;

function buildActions<T, TKey extends keyof T>(obj: T): CreateActionsType<T> {
  return (Object.entries(obj) as Entry<T>[])
    .filter(([, func]) => typeof func === "function")
    .reduce(
      (a, [key, func]) => ({
        ...a,
        [key]: isAsync(func)
          ? (payload: T[TKey]) => (dispatch: Function, getState: Function, extraArgument: any) =>
              (func as unknown as Function).bind(obj)(dispatch, getState, extraArgument, payload)
          : (payload: T[TKey]) => ({ type: key, payload })
      }),
      {} as CreateActionsType<T>
    );
}

function buildInitState<T>(obj: T): InitStateType<T> {
  return (Object.entries(obj) as Entry<T>[])
    .filter(([, func]) => typeof func !== "function")
    .reduce((a, [key, value]) => ({ ...a, [key]: value }), {} as InitStateType<T>);
}

function buildInternalReducer<T>(obj: T) {
  const initialState = buildInitState(obj);

  const callbacks = (Object.entries(obj) as Entry<T>[])
    .filter(([, func]) => typeof func === "function")
    .reduce((a, [key, func]) => ({ ...a, [key]: func }), {
      reset: () => initialState
    } as CreateReducerType<T> | { reset: () => void });

  const stateReducer = new Proxy(callbacks, {
    get: function (target: any, p: string | symbol) {
      return ((target[p] as Function) || identityFn).bind(target);
    }
  });

  return (state = initialState, { type, payload }: ActionPayload<T>) =>
    (stateReducer[type] as Function)(state, payload);
}

function buildReducer<T extends object>(obj: T) {
  const actions = buildActions(obj);
  const reducer = buildInternalReducer(obj);

  return {
    reducer,
    actions
  };
}

const obj = buildReducer({
  a: 100,
  b: "abc",
  init: (state: object) => state,
  send(state: object, payload: number) {
    return { ...state, payload };
  },
  text(state: object, text: string) {
    return { ...state, text };
  },
  async longShot(state: object, long: number) {
    return { ...state, long };
  }
});

// let x: FunctionProperties<{
//   a: 100;
//   b: "abc";
//   init: (state: object) => object;
//   send(state: object, payload: number): object;
//   longShot(state: object, payload: number): object;
// }> = {
//   init: (state: object) => state,
//   send(state: object, payload: number) {
//     return { ...state, payload };
//   },
//   async longShot(state: object, payload: number) {
//     return { ...state, payload };
//   }
// };

// obj.actions.send("a");

// console.log("x: ", x);

(async function () {
  console.log("obj: ", obj.actions.send(3));
  console.log(obj.reducer);
  const state1 = obj.reducer(undefined, obj.actions.init());
  console.log("state1: ", state1);
  const state2 = obj.reducer(state1, obj.actions.send(2));
  console.log("state2: ", state2);
  const state4 = obj.reducer(state1, obj.actions.send(4));
  console.log("state4: ", state4);
  const state5 = obj.reducer(state4, await obj.actions.longShot(8));
  console.log("state5: ", state5);
  const state6 = obj.reducer(state5, obj.actions.text("aaa"));
  console.log("state6: ", state6);
})();
// obj.reducer(state1, { type: "send", payload: "4" });
// const state5 = obj.reducer(state1, obj.actions.longShot(5));
// console.log("state5: ", state5);
// console.log("obj: ", obj.actions.send("b"));
