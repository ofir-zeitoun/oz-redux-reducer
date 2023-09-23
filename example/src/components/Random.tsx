import { useDispatch } from "react-redux";
import { testActions } from "store";

export default function Random() {
  const dispatch = useDispatch();
  return (
    <button
      onClick={() => dispatch(testActions.fetchRandom())}
      style={{ background: "green", color: "yellow" }}
    >
      Random
    </button>
  );
}
