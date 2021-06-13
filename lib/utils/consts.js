"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.identityFn = exports.AsyncFunction = void 0;
exports.AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
const identityFn = (value) => value;
exports.identityFn = identityFn;
