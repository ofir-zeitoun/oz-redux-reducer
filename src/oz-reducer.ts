import { buildCallback, Constructor, identityFn, Payload, Reducer } from "./utils";

const actions = Symbol("actions");
const state = Symbol("state");
const reset = Symbol("reset");

export function ozReducer<T extends Constructor>(constructor: T) {
  const getInitialState = (that: any) => {
    const { [state]: initMembers = [] } = constructor.prototype;
    delete constructor.prototype[state];

    return initMembers.reduce((a: object, c: string) => ({ ...a, [c]: that[c] }), {});
  };

  const buildReducer = (that: Reducer<T>) => {
    const initialState = getInitialState(that);

    const callbacks = new Proxy(that, {
      get: function <U extends keyof (Reducer<T> | { [reset]: Function })>(
        obj: Reducer<T>,
        prop: U
      ) {
        if (prop === reset) {
          return () => initialState;
        }
        return ((obj[prop] as Function) || identityFn).bind(that);
      }
    });
    // callbacks[reset] = () => initialState;

    that.reducer = (state: T = initialState, { type, payload, ...rest }: Payload<T, any>) =>
      (callbacks[type] as Function)(state, payload, rest);
  };

  const buildActions = (that: Reducer<T>) => {
    const { [actions]: actionKeys = [] } = constructor.prototype;
    delete constructor.prototype[actions];

    that.actions = actionKeys.reduce(
      <U extends keyof Reducer<T>>(acc: T, name: U) => ({
        ...acc,
        [name]: buildCallback<T, U>(name)(that)
      }),
      {
        resetState: () => ({ type: reset })
      }
    );
  };

  return class ReducerWrapper extends constructor {
    constructor(...args: any[]) {
      super(...args);

      buildReducer(this as unknown as Reducer<T>);
      buildActions(this as unknown as Reducer<T>);
    }
  };
}

export function action(
  target: any,
  propertyKey: string,
  propertyDescriptor: PropertyDescriptor
): PropertyDescriptor {
  target[actions] = [...(target[actions] || []), propertyKey];
  return propertyDescriptor;
}

export function initial(target: any, propertyKey: string) {
  target[state] = [...(target[state] || []), propertyKey];
}
