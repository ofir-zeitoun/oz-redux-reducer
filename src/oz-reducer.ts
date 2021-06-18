import { buildCallback, Constructor, identityFn, Payload } from "./utils";

const actions = Symbol("actions");
const state = Symbol("state");
const reset = Symbol("reset");

export function ozReducer<T extends Constructor>(constructor: T) {
  const getInitialState = (that: any) => {
    const { [state]: initMembers = [] } = constructor.prototype;
    delete constructor.prototype[state];

    return initMembers.reduce((a: object, c: string) => ({ ...a, [c]: that[c] }), {});
  };

  const buildReducer = (that: any) => {
    const initialState = getInitialState(that);

    const callbacks = new Proxy(that, {
      get: function (obj, prop) {
        const { [prop]: func = identityFn } = obj;
        return func.bind(obj);
      }
    });
    callbacks[reset] = () => initialState;

    that.reducer = (state: object = initialState, { type, payload, ...rest }: Payload<any>) =>
      callbacks[type](state, payload, rest);
  };

  const buildActions = (that: any) => {
    const { [actions]: actionKeys = [] } = constructor.prototype;
    delete constructor.prototype[actions];

    that.actions = actionKeys.reduce(
      <T extends object, U extends keyof T>(acc: T, name: U) => ({
        ...acc,
        [name]: buildCallback<T, U>(name)(that)
      }),
      {
        resetState: () => ({ type: reset })
      }
    );
  };

  return class extends constructor {
    constructor(...args: any[]) {
      super(...args);

      buildReducer(this);
      buildActions(this);
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
