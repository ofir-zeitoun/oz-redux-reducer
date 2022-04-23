import { useSelector } from "react-redux";

export default function Sum() {
  const sum: number = useSelector((state: { test: { sum: number } }) => state.test.sum);
  return <div>Sum: {sum}</div>;
}
