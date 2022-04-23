export type Constructor<T = {}> = new (...args: any[]) => T;

// https://stackoverflow.com/questions/63447660/typescript-remove-all-properties-with-particular-type
export type Without<
  T,
  V,
  WithNevers = {
    [K in keyof T]: Exclude<T[K], undefined> extends V
      ? never
      : T[K] extends Record<string, unknown>
      ? Without<T[K], V>
      : T[K];
  }
> = Pick<
  WithNevers,
  {
    [K in keyof WithNevers]: WithNevers[K] extends never ? never : K;
  }[keyof WithNevers]
>;

/// Returns a union of keys from T that are of type U
export type ExtractKeys<T, U> = {
  [Key in keyof T]: T[Key] extends U ? Key : never;
}[keyof T] &
  keyof T;

export type ExtractType<T, U> = Pick<T, ExtractKeys<T, U>>;

/// Returns a union of keys from T that are not of type U
export type ExcludeKeys<T, U> = {
  [Key in keyof T]: T[Key] extends U ? never : Key;
}[keyof T] &
  keyof T;

export type ExcludeType<T, U> = Pick<T, ExcludeKeys<T, U>>;

export type Entry<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T];
