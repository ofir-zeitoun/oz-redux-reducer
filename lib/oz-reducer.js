"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initial = exports.action = exports.ozReducer = void 0;
const utils_1 = require("./utils");
const actions = Symbol("actions");
const state = Symbol("state");
const reset = Symbol("reset");
function ozReducer(constructor) {
    const getInitialState = (that) => {
        const { [state]: initMembers = [] } = constructor.prototype;
        delete constructor.prototype[state];
        return initMembers.reduce((a, c) => ({ ...a, [c]: that[c] }), {});
    };
    const buildReducer = (that) => {
        const initialState = getInitialState(that);
        const callbacks = new Proxy(that, {
            get: function (obj, prop) {
                if (prop === reset) {
                    return () => initialState;
                }
                return (obj[prop] || utils_1.identityFn).bind(that);
            }
        });
        that.reducer = (state = initialState, { type, payload, ...rest }) => callbacks[type](state, payload, rest);
    };
    const buildActions = (that) => {
        const { [actions]: actionKeys = [] } = constructor.prototype;
        delete constructor.prototype[actions];
        that.actions = actionKeys.reduce((acc, name) => ({
            ...acc,
            [name]: utils_1.buildCallback(name)(that)
        }), {
            resetState: () => ({ type: reset })
        });
    };
    return class ReducerWrapper extends constructor {
        constructor(...args) {
            super(...args);
            buildReducer(this);
            buildActions(this);
        }
    };
}
exports.ozReducer = ozReducer;
function action(target, propertyKey, propertyDescriptor) {
    target[actions] = [...(target[actions] || []), propertyKey];
    return propertyDescriptor;
}
exports.action = action;
function initial(target, propertyKey) {
    target[state] = [...(target[state] || []), propertyKey];
}
exports.initial = initial;
