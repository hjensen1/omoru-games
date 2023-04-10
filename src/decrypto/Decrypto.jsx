import { useState } from "react"
import { useSelector } from "react-redux"
import { hostId } from "../peerjsMiddleware/hostId"
import { peerId } from "../peerjsMiddleware/peerId"
import GameBoard from "./GameBoard"
import { doAddPlayer } from "./cauldron/gameMeta"
import { startGame } from "./gameSetup"
import TurnEnder from "./TurnEnder"

export default function Decrypto() {
  const players = useSelector((state) => state.players)
  const self = players.find((p) => p.id === peerId)
  const canStartGame = useSelector(
    (state) => state.rounds[0].length === 0 && state.teams[0].length >= 1 && state.teams[1].length >= 1
  )

  if (!self) {
    return <JoinGame />
  }
  // if (self.team == null) {
  //   return <JoinTeam />
  // }
  return (
    <div className="flex flex-col items-center">
      {hostId === peerId && canStartGame && (
        <button className="btn flex-0 w-32 mt-6" onClick={startGame}>
          Start Game
        </button>
      )}
      <div className="flex justify-center p-8 space-x-8">
        <GameBoard team={0} self={self} />
        <GameBoard team={1} self={self} />
      </div>
      <TurnEnder />
    </div>
  )
}

function JoinGame() {
  const [name, setName] = useState("")

  return (
    <div className="flex justify-center items-center h-full w-full space-x-4 mt-8">
      <div className="input-container">
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
      </div>
      <button
        className="btn flex-0"
        disabled={!name}
        onClick={() => {
          if (name) doAddPlayer(peerId, name)
        }}
      >
        Join Game
      </button>
    </div>
  )
}
