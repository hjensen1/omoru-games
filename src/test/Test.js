import { useSelector, useDispatch } from "react-redux"
import { incrementCounter } from "./connectionTestSlice"

export default function Test() {
  const dispatch = useDispatch()
  const counter = useSelector((state) => state.connectionTest.counter)
  return (
    <div className="flex flex-col">
      <div className="text-20 mb-4">{counter}</div>
      <button onClick={() => dispatch(incrementCounter())}>Test</button>
    </div>
  )
}
