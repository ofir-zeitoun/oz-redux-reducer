import { useDispatch } from "react-redux";

import { testActions } from "store";

export default function Reset() {
  const dispatch = useDispatch();

  return (
    <button
      onClick={() => dispatch(testActions.reset())}
      style={{ background: "red", color: "white" }}
    >
      Reset
    </button>
  );
}
