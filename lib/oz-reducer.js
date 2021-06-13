"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initial = exports.action = exports.ozReducer = void 0;
const utils_1 = require("./utils");
const actions = Symbol("actions");
const asyncActions = Symbol("asyncActions");
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
                const { [prop]: func = utils_1.identityFn } = obj;
                return func;
            }
        });
        callbacks[reset] = () => initialState;
        that.reducer = (state = initialState, { type, payload, ...rest }) => callbacks[type](state, payload, rest);
    };
    const buildActions = (that) => {
        const { [actions]: actionKeys = [], [asyncActions]: asyncActionsKeys = [] } = constructor.prototype;
        delete constructor.prototype[actions];
        delete constructor.prototype[asyncActions];
        const simpleActions = actionKeys.reduce((a, type) => ({
            ...a,
            [type]: (payload) => ({ type, payload })
        }), {
            resetState: () => ({ type: reset })
        });
        that.actions = asyncActionsKeys.reduce((a, type) => ({
            ...a,
            [type]: (payload) => (dispatch, getState, extraArgument) => that[type](dispatch, getState, extraArgument, payload)
        }), simpleActions);
    };
    return class extends constructor {
        constructor(...args) {
            super(...args);
            buildReducer(this);
            buildActions(this);
        }
    };
}
exports.ozReducer = ozReducer;
function action(target, propertyKey, propertyDescriptor) {
    const actionsType = propertyDescriptor.value.constructor.name === utils_1.AsyncFunction.name ? asyncActions : actions;
    target[actionsType] = [...(target[actionsType] || []), propertyKey];
    return propertyDescriptor;
}
exports.action = action;
function initial(target, propertyKey) {
    target[state] = [...(target[state] || []), propertyKey];
}
exports.initial = initial;
