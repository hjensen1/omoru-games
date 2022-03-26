import { useSelector } from "react-redux"
import { enhance, state } from "../redux/redux2"

export default function Test() {
  const counter = useSelector((state) => state.connectionTest.counter)
  return (
    <div className="flex flex-col">
      <div className="text-20 mb-4">{counter}</div>
      <button onClick={() => doIncrementCounter()}>Test</button>
    </div>
  )
}

const doIncrementCounter = enhance(function incrementCounter() {
  state.connectionTest.counter++
})
