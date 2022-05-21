import { useCheckbox, useInput, useTextInput } from "hooks/useInput";
// import { ChangeEvent, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { testActions } from "store";

export default function Word() {
  const dispatch = useDispatch();
  // const [wordLength, setWordLength] = useState(5);
  const [wordLength, , onLengthChanged] = useInput(9);

  const [checked, , onCheckedChanged] = useCheckbox(true, {
    parseBoolean: Boolean
  });

  const [text, , onTextChanged, error] = useTextInput("Hello", {
    regex: /^Hello.{1,3}$/
    // parseString: (s1: string) => s1
  });

  const [numberValue, , onNumberChanged, numberError] = useTextInput(0, {
    // parseNumber: Number,
    regex: /^([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/
  });
  console.log("numberValue: ", numberValue);

  const { word, prev } = useSelector(
    (state: { test: { word: string; prev: string } }) => ({
      word: state.test.word,
      prev: state.test.prev
    }),
    shallowEqual
  );

  return (
    <div>
      <div>Old word: {prev}</div>
      <div>Word: {word}</div>
      <input type="range" min="3" max="10" value={wordLength} onChange={onLengthChanged} step="1" />
      <button
        onClick={() => dispatch(testActions.fetchWord(wordLength))}
        style={{ background: "pink", color: "red" }}
      >
        {`Get ${wordLength} letters word`}
      </button>
      <br />
      <input id="checkbox" type="checkbox" checked={checked} onChange={onCheckedChanged} />
      <label htmlFor="checkbox">Checkbox</label>
      <br />
      <input id="text" type="text" value={text} onChange={onTextChanged} />
      <label htmlFor="text" style={{ color: error ? "red" : "unset" }}>
        Text
      </label>
      <br />
      <input id="number" type="text" onChange={onNumberChanged} />
      <label htmlFor="number" style={{ color: numberError ? "red" : "unset" }}>
        Number: {numberValue}
      </label>
      <br />
    </div>
  );
}
