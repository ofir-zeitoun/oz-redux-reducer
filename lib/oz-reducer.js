"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initial = exports.action = exports.ozReducer = void 0;
const actions = Symbol("actions");
const state = Symbol("state");
function ozReducer(constructor) {
    const getInitialState = (that) => {
        const { [state]: initMembers = [] } = constructor.prototype;
        delete constructor.prototype[state];
        return initMembers.reduce((a, c) => ({ ...a, [c]: that[c] }), {});
    };
    const buildReducer = (that) => {
        that.initialState = getInitialState(that);
        const callbacks = new Proxy(that, {
            get: function (obj, prop) {
                const { [prop]: func = (state) => state } = obj;
                return func;
            }
        });
        that.reducer = (state = that.initialState, { type, payload, ...rest }) => callbacks[type](state, payload, rest);
    };
    const buildActions = (that) => {
        const { [actions]: actionKeys = [] } = constructor.prototype;
        delete constructor.prototype[actions];
        const isAsync = (type) => that[type].constructor.name === "AsyncFunction";
        that.actions = actionKeys.reduce((a, type) => ({
            ...a,
            [type]: isAsync(type) ?
                (payload) => (dispatch, getState, extraArgument) => that[type](dispatch, getState, extraArgument, payload) :
                (payload) => ({ type, payload })
        }), {});
    };
    return class extends constructor {
        constructor(...args) {
            super(...args);
            buildReducer(this);
            buildActions(this);
        }
        ;
    };
}
exports.ozReducer = ozReducer;
function action(target, propertyKey, propertyDescriptor) {
    target[actions] = [...target[actions] || [], propertyKey];
    return propertyDescriptor;
}
exports.action = action;
function initial(target, propertyKey) {
    target[state] = [...target[state] || [], propertyKey];
}
exports.initial = initial;
