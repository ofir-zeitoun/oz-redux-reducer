import { AsyncFunction, Constructor, identityFn, Payload } from "./utils";

const actions = Symbol("actions");
const asyncActions = Symbol("asyncActions");
const state = Symbol("state");

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
        return func;
      }
    });
    that.reducer = (state: object = initialState, { type, payload, ...rest }: Payload<any>) =>
      callbacks[type](state, payload, rest);
  };

  const buildActions = (that: any) => {
    const { [actions]: actionKeys = [], [asyncActions]: asyncActionsKeys = [] } =
      constructor.prototype;
    delete constructor.prototype[actions];
    delete constructor.prototype[asyncActions];

    const simpleActions = actionKeys.reduce(
      (a: object, type: string) => ({
        ...a,
        [type]: (payload: any) => ({ type, payload })
      }),
      {}
    );

    that.actions = asyncActionsKeys.reduce(
      (a: object, type: string) => ({
        ...a,
        [type]: (payload: any) => (dispatch: Function, getState: Function, extraArgument: any) =>
          that[type](dispatch, getState, extraArgument, payload)
      }),
      simpleActions
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
  const actionsType =
    propertyDescriptor.value.constructor.name === AsyncFunction.name ? asyncActions : actions;

  target[actionsType] = [...(target[actionsType] || []), propertyKey];
  return propertyDescriptor;
}

export function initial(target: any, propertyKey: string) {
  target[state] = [...(target[state] || []), propertyKey];
}
