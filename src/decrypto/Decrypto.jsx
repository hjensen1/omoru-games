import { useState } from "react"
import { useSelector } from "react-redux"
import { joinGame, joinTeam, otherTeam } from "./decryptoSlice"
import GameBoard from "./GameBoard"

export default function Decrypto() {
  const players = useSelector((state) => state.players)
  const self = players.find((p) => p.id === window.peerId)

  if (!self) {
    return <JoinGame />
  }
  if (self.team == null) {
    return <JoinTeam />
  }
  return (
    <div className="flex justify-center p-8 space-x-8">
      <GameBoard team={self.team} self={self} />
      <GameBoard team={otherTeam(self.team)} self={self} />
    </div>
  )
}

function JoinGame() {
  const [name, setName] = useState("")

  return (
    <div className="flex justify-center items-center h-full w-full space-x-4">
      <div className="input-container">
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
      </div>
      <button
        className="btn flex-0"
        disabled={!name}
        onClick={() => {
          if (name) joinGame(name)
        }}
      >
        Join Game
      </button>
    </div>
  )
}

function JoinTeam() {
  return (
    <div className="flex justify-center items-center h-full w-full space-x-4">
      <button className="btn flex-0" onClick={() => joinTeam(0)}>
        Join Blue Team
      </button>
      <button className="btn btn-red flex-0" onClick={() => joinTeam(1)}>
        Join Red Team
      </button>
    </div>
  )
}
