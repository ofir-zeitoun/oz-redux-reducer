"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildOzReducer = void 0;
const utils_1 = require("./utils");
const isAsync = (func) => func.constructor.name === utils_1.AsyncFunction.name;
function buildActions(obj) {
    return Object.entries(obj)
        .filter(([, func]) => typeof func === "function")
        .reduce((a, [key, func]) => ({
        ...a,
        [key]: isAsync(func)
            ? (payload) => (dispatch, getState, extraArgument) => func.bind(obj)(dispatch, getState, extraArgument, payload)
            : (payload) => ({ type: key, payload })
    }), {
        resetState() {
            return { type: "resetState" };
        }
    });
}
function buildInitState(obj) {
    return Object.entries(obj)
        .filter(([, func]) => typeof func !== "function")
        .reduce((a, [key, value]) => ({ ...a, [key]: value }), {});
}
function buildInternalReducer(obj) {
    const initialState = buildInitState(obj);
    const callbacks = Object.entries(obj)
        .filter(([, func]) => typeof func === "function")
        .reduce((a, [key, func]) => ({ ...a, [key]: func }), {
        resetState: () => initialState
    });
    const stateReducer = new Proxy(callbacks, {
        get: function (target, p) {
            return (target[p] || utils_1.identityFn).bind(target);
        }
    });
    return (state = initialState, { type, payload }) => stateReducer[type](state, payload);
}
function buildOzReducer(obj) {
    const actions = buildActions(obj);
    const reducer = buildInternalReducer(obj);
    return [reducer, actions];
}
exports.buildOzReducer = buildOzReducer;
