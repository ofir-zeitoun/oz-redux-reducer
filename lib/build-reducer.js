"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildReducer = void 0;
const utils_1 = require("./utils");
function buildActions(obj) {
    const reset = new utils_1.ResetState({});
    return Object.entries(obj).concat(Object.entries(reset))
        .filter(([, func]) => (0, utils_1.isFunc)(func))
        .reduce((a, [key, func]) => ({
        ...a,
        [key]: (0, utils_1.isAsync)(func)
            ? (payload) => (dispatch, getState, extraArgument) => func.bind(obj)(dispatch, getState, extraArgument, payload)
            : (payload) => ({ type: key, payload })
    }), {});
}
function buildInitState(obj) {
    return Object.entries(obj)
        .filter(([, func]) => !(0, utils_1.isFunc)(func))
        .reduce((a, [key, value]) => ({ ...a, [key]: value }), {});
}
function buildInternalReducer(obj) {
    const initialState = buildInitState(obj);
    const init = new utils_1.ResetState(initialState);
    const callbacks = Object.entries(obj).concat(Object.entries(init))
        .filter(([, func]) => (0, utils_1.isFunc)(func))
        .reduce((a, [key, func]) => ({
        ...a,
        [key]: func
    }), init);
    const stateReducer = new Proxy(callbacks, {
        get: function (target, p) {
            return (target[p] || utils_1.identityFn).bind(target);
        }
    });
    return (state = initialState, { type, payload }) => stateReducer[type](state, payload);
}
function buildReducer(obj) {
    const actions = buildActions(obj);
    const reducer = buildInternalReducer(obj);
    return [reducer, actions];
}
exports.buildReducer = buildReducer;
