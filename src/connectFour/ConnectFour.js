import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import classNames from "classnames"

import { addPlayer, playPiece } from "./connectFourSlice"

export default function ConnectFour({}) {
  const { columns, currentPlayer, message } = useSelector((state) => state.connectFour)

  return (
    <div className="flex flex-col items-center">
      <div className="text-32 h-10 mb-2">{message}</div>
      <ConnectFourPlayers />
      <div className="flex bg-gray-400 px-2 mt-8">
        {columns.map((column, i) => (
          <ConnectFourColumn
            column={column}
            index={i}
            myTurn={window.peerId === currentPlayer?.id}
          />
        ))}
      </div>
    </div>
  )
}

function ConnectFourPlayers({}) {
  const dispatch = useDispatch()
  const players = useSelector((state) => state.connectFour.players)
  const [name, setName] = useState("")

  return (
    <>
      {players.length > 0 && (
        <div className="flex-center text-20">
          <div className="flex items-center justify-end w-48 font-medium">
            <span>{players[0]?.name}</span>
            <span className="ml-2 w-5 h-5 rounded-full bg-red-800" />
          </div>
          <div className="mx-4">vs</div>
          <div className="flex items-center w-48 font-medium">
            <span>{players[1]?.name}</span>
            <span className="ml-2 w-5 h-5 rounded-full bg-black" />
          </div>
        </div>
      )}
      {players.length < 2 && !players.some((p) => p.id === window.peerId) && (
        <div className="flex">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name to join"
            className="w-64 text-14 px-2 bg-transparent text-black border border-gray-600 rounded-sm focus:outline-none"
          />
          <button
            className="text-16 font-medium ml-3 focus:outline-none text-gray-900 hover:text-black"
            onClick={() => dispatch(addPlayer({ id: window.peerId, name }))}
          >
            Join
          </button>
        </div>
      )}
    </>
  )
}

const rows = [0, 1, 2, 3, 4, 5]

function ConnectFourColumn({ column, myTurn, index }) {
  const dispatch = useDispatch()
  const cellSize = 96
  const innerSize = 88
  const lastPlay = useSelector((state) => state.connectFour.lastPlay)
  const canPlay = column.length < 6 && myTurn

  return (
    <button
      disabled={!canPlay}
      className={classNames("flex flex-col-reverse py-2 focus:outline-none", {
        "cursor-pointer hover:bg-gray-300": canPlay,
        "cursor-default": !canPlay,
      })}
      style={{ width: cellSize, height: cellSize * 6 }}
      onClick={() => dispatch(playPiece(index))}
    >
      {rows.map((i) => (
        <div
          className="flex justify-center items-center"
          style={{ width: cellSize, height: cellSize }}
        >
          <div
            className={classNames("rounded-full", {
              "bg-red-800": column[i] === "-",
              "bg-black": column[i] === "X",
              "bg-gray-500": !column[i],
              "box-border border-2 border-gray-300": lastPlay[0] === index && lastPlay[1] === i,
            })}
            style={{ width: innerSize, height: innerSize }}
          />
        </div>
      ))}
    </button>
  )
}
