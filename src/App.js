import { whichGame } from "./rootReducer"
import Test from "./test/Test"
import ConnectFour from "./connectFour/ConnectFour"

export default function App() {
  let game
  console.log(whichGame)
  if (whichGame.startsWith("connectFour")) {
    game = <ConnectFour />
  } else {
    game = <Test />
  }
  return <div className="flex-center w-full h-full bg-gray-500">{game}</div>
}
