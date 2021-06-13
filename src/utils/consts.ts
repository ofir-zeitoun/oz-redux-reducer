export const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

export const identityFn = <T>(value: T)=>value;