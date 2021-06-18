"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCallback = void 0;
const consts_1 = require("./consts");
const isAsync = (func) => func.constructor.name === consts_1.AsyncFunction.name;
const buildCallback = (key) => (obj) => {
    const func = obj[key];
    return isAsync(func)
        ? (payload) => (dispatch, getState, extraArgument) => func.bind(obj)(dispatch, getState, extraArgument, payload)
        : (payload) => ({ type: key, payload });
};
exports.buildCallback = buildCallback;
