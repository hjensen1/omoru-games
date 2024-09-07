import { useState } from "react"
import { doAddPlayer } from "./cauldron/gameMeta"
import { peerId } from "../peerjsMiddleware/peerId"
import { hostId } from "../peerjsMiddleware/hostId"

export default function JoinGame() {
  const [mode, setModeBase] = useState(peerId === hostId ? "chooseMode" : "joinEnterName")
  const [name, setName] = useState("")
  function setMode(newMode) {
    setName("")
    setModeBase(newMode)
  }

  function connectToHostId(id) {
    window.location.href = window.location.href.replace(/#.+$/, `#${id}`)
    window.location.reload()
  }

  function hostGame() {
    if (peerId !== hostId) {
      connectToHostId(peerId)
    }
    setMode("hostEnterName")
  }

  return (
    <div className="flex flex-col justify-center items-center h-full w-full space-y-4">
      {mode === "chooseMode" && (
        <>
          <button className="btn flex-0" onClick={() => setMode("enterId")}>
            Join Game
          </button>
          <div className="text-gray-400 font-medium">— OR —</div>
          <button className="btn flex-0" onClick={hostGame}>
            Host Game
          </button>
        </>
      )}
      {mode === "joinEnterName" && (
        <>
          <div className="flex justify-center items-center space-x-4">
            <div className="input-container w-56">
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name to get started"
              />
            </div>
            <button
              className="btn flex-0"
              disabled={!name}
              onClick={() => {
                if (name) doAddPlayer(peerId, name)
              }}
            >
              Submit
            </button>
          </div>
          <div className="text-gray-400 font-medium">— OR —</div>
          <button className="btn flex-0" onClick={() => setMode("enterId")}>
            Join A Different Game
          </button>
          <div className="text-gray-400 font-medium">— OR —</div>
          <button className="btn flex-0" onClick={hostGame}>
            Host Game
          </button>
        </>
      )}
      {mode === "hostEnterName" && (
        <>
          <div className="flex justify-center items-center space-x-4">
            <div className="input-container w-56">
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name to get started"
              />
            </div>
            <button
              className="btn flex-0"
              disabled={!name}
              onClick={() => {
                if (name) doAddPlayer(peerId, name)
              }}
            >
              Submit
            </button>
          </div>
          <div className="text-gray-400 font-medium">— OR —</div>
          <button className="btn flex-0" onClick={() => setMode("enterId")}>
            Join A Different Game
          </button>
        </>
      )}
      {mode === "enterId" && (
        <>
          <div className="flex justify-center items-center space-x-4">
            <div className="input-container">
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter 6-digit game ID"
              />
            </div>
            <button
              className="btn flex-0"
              disabled={name.length !== 6}
              onClick={() => {
                connectToHostId(name)
              }}
            >
              Submit
            </button>
          </div>
          <div className="text-gray-400 font-medium">— OR —</div>
          <button className="btn flex-0" onClick={hostGame}>
            Host Game
          </button>
        </>
      )}
    </div>
  )
}
