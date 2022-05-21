const AsyncFunction = "AsyncFunction";

export const identityFn = <T>(value: T) => value;

export const isFunc = (func: any) => typeof func === "function";

const isAsyncCompiled =
  /((\.(then|catch)\s*\()|(^async\s+)|(\s+new\s+Promise\s*\()|(\s+Promise\.)|(\s+await\s+))/;

export const isAsync = (func: any) => {
  // dev mode
  if (func.constructor.name === AsyncFunction) {
    return true;
  }

  return isAsyncCompiled.test(func.toString());
};
