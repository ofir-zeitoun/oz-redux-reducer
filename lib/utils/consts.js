"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAsync = exports.isFunc = exports.identityFn = void 0;
const AsyncFunction = "AsyncFunction";
const identityFn = (value) => value;
exports.identityFn = identityFn;
const isFunc = (func) => typeof func === "function";
exports.isFunc = isFunc;
const isAsyncCompiled = /((\.(then|catch)\s*\()|(^async\s+)|(\s+new\s+Promise\s*\()|(\s+Promise\.)|(\s+await\s+))/;
const isAsync = (func) => {
    if (func.constructor.name === AsyncFunction) {
        return true;
    }
    return isAsyncCompiled.test(func.toString());
};
exports.isAsync = isAsync;
