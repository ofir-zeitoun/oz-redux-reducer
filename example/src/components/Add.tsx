import { useDispatch } from "react-redux";

import { testActions } from "store";
export default function Add({ amount = 1 }: { amount: number }) {
  const dispatch = useDispatch();

  return <button onClick={() => dispatch(testActions.add(amount))}>{`Add +${amount}`}</button>;
}
