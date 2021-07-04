import { useDispatch, useSelector } from "react-redux"
import { incrementCounter } from "./reducers/connectionTestSlice"

export default function App() {
  const dispatch = useDispatch()
  const counter = useSelector((state) => state.connectionTest.counter)
  return (
    <div className="flex flex-col justify-center pt-64 w-full h-full bg-gray-500">
      <div className="text-20 mb-4">{counter}</div>
      <button onClick={() => dispatch(incrementCounter())}>Test</button>
    </div>
  )
}
