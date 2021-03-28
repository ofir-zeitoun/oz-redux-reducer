import { Constructor, Payload } from "./utils";

const actions = Symbol("actions");
const state = Symbol("state");

export function ozReducer<T extends Constructor>(constructor: T) {

  const getInitialState = (that: any) => {
    const { [state]: initMembers = [] } = constructor.prototype;
    delete constructor.prototype[state];

    return initMembers.reduce((a: object, c: string) => ({ ...a, [c]: that[c] }), {});
  }

  const buildReducer = (that: any) => {
    const initialState = getInitialState(that);
    const callbacks = new Proxy(that, {
      get: function (obj, prop) {
        const { [prop]: func = (state: object) => state } = obj;
        return func;
      }
    });
    that.reducer = (state: object = initialState, { type, payload, ...rest }: Payload<any>) =>
      callbacks[type](state, payload, rest);
  }

  const buildActions = (that: any) => {
    const { [actions]: actionKeys = [] } = constructor.prototype;
    delete constructor.prototype[actions];

    const isAsync = (type: string) => that[type].constructor.name === "AsyncFunction";

    that.actions = actionKeys.reduce((a: object, type: string) => ({
      ...a,
      [type]: isAsync(type) ?
        (payload: any) =>
          (dispatch: Function, getState: Function, extraArgument: any) =>
            that[type](dispatch, getState, extraArgument, payload) :
        (payload: any) => ({ type, payload })
    }), {})
  }

  return class extends constructor {
    constructor(...args: any[]) {
      super(...args);


      buildReducer(this);
      buildActions(this);
    };
  }
}

export function action(target: any, propertyKey: string, propertyDescriptor: PropertyDescriptor): PropertyDescriptor {
  target[actions] = [...target[actions] || [], propertyKey];
  return propertyDescriptor;
}

export function initial(target: any, propertyKey: string) {
  target[state] = [...target[state] || [], propertyKey];
}