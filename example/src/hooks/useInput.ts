import { ChangeEvent, useCallback, useRef, useState } from "react";

export const identityFn = <T>(x: T) => x;

export function getChecked(e: ChangeEvent<HTMLInputElement>) {
  return e.target.checked;
}

function defaultGetValue(e: ChangeEvent<HTMLInputElement>) {
  return e.target.value;
}

type Parser = {
  parseNumber(value: string): number;
  parseString(value: string): string;
  parseBoolean(value: string): boolean;
  parseObject(value: string): object;
};

type FuncOFType<T> = {
  // [P in keyof Parser]:  P extends `parse${Capitalize<T>}` ? P : never // Type 'T' does not satisfy the constraint 'string'.(2344)
  [P in keyof Parser]: ReturnType<Parser[P]> extends T ? P : never;
}[keyof Parser] &
  keyof Parser;

type Parse<T> = Pick<Parser, FuncOFType<T>>;

export type UseInputOptions<T> = Partial<
  {
    getValue: Function;
  } & Parse<T>
>;

function getParse<T>(options?: UseInputOptions<T>): Function {
  const [parse = JSON.parse] = Object.entries(options || {})
    .filter(([key]) => key.startsWith("parse"))
    .map(([, parse]) => parse);
  return parse;
}

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
type EventHandler = (e: ChangeEvent<HTMLInputElement>) => void;
export function useInput<T>(
  initValue: T,
  options?: UseInputOptions<T>
): [T, SetState<T>, EventHandler] {
  const [value, setValue] = useState<T>(initValue);
  const parseRef = useRef(getParse(options));

  // do we need useCallback??? value causes rerendering anyway
  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      // console.log("e: ", e.target.value);
      const getValue = options?.getValue || defaultGetValue;
      // console.log("getValue: ", getValue);
      const temp = getValue(e);
      // console.log("temp: ", temp, typeof temp);

      const newValue = parseRef.current(temp);
      // console.log("newValue: ", newValue, typeof newValue, typeof value);
      setValue(newValue);
    },
    [options?.getValue]
  );

  return [value, setValue, onChange];
}

export function useCheckbox(initValue: boolean = false, options?: UseInputOptions<boolean>) {
  return useInput(initValue, {
    getValue: getChecked,
    ...options
  });
}

export type UseTextInputOptions<T> = Partial<
  {
    regex: RegExp;
  } & UseInputOptions<T>
>;

export function useTextInput<T>(
  initValue: T,
  options?: UseTextInputOptions<T>
): [T, SetState<T>, EventHandler, boolean] {
  const [hasError, setHasError] = useState(false);

  const getValue = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const originGetValue = options?.getValue || defaultGetValue;
      const text = originGetValue!(e);
      if (options?.regex?.test(text) === false) {
        setHasError(true);
      } else {
        setHasError(false);
      }
      return text;
    },
    [options?.getValue, options?.regex]
  );

  const res = useInput(initValue, {
    getValue,
    ...(options as UseInputOptions<T>),
    // make sure parseString exists on String because JSON.parse fail to parse 'normal' string
    ...(typeof initValue === "string" && {
      parseString: (options as any).parseString || identityFn
    })
  });
  return [...res, hasError];
}
