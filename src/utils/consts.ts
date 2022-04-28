const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

export const identityFn = <T>(value: T) => value;

export const isFunc = (func: any) => typeof func === "function";

export const isAsync = (func: any) => func.constructor.name === AsyncFunction.name;
