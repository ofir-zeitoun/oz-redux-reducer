import { useDispatch, useSelector } from "react-redux";
import { testActions } from "store";

export default function Sum() {
  const dispatch = useDispatch();

  const { word, prev } = useSelector(
    (state: { test: { word: string; prev: string } }) => state.test
  );

  return (
    <div>
      <div>Old word: {prev}</div>
      <div>Word: {word}</div>
      <button
        onClick={() => dispatch(testActions.fetchWord(word))}
        style={{ background: "pink", color: "red" }}
      >
        Get word
      </button>
    </div>
  );
}
