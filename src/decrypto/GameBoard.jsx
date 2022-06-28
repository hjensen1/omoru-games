import clsx from "clsx"
import React, { createContext, useContext, useMemo } from "react"
import { useState } from "react"
import { useSelector } from "react-redux"

const GameBoardContext = createContext({})
function useGameBoardContext() {
  return useContext(GameBoardContext)
}

export default function GameBoard({ team, self }) {
  const contextData = useMemo(
    () => ({
      team,
      self,
    }),
    [team, self]
  )

  return (
    <GameBoardContext.Provider value={contextData}>
      <div className="space-y-6">
        <TeamMembers />
        <Words />
        <ClueInputs />
        <GuessInputs />
        <RoundHistory />
      </div>
    </GameBoardContext.Provider>
  )
}

function TeamMembers() {
  const { team, self } = useGameBoardContext()

  const teamPlayers = [
    { name: "Hayden", id: "1", cluegiver: true },
    { name: "Andy", id: "2" },
  ]

  return (
    <div className={clsx("w-[40rem] ", team === 0 ? "panel-blue" : "panel-red")}>
      <div className="mb-1 text-20 font-medium">{team === 0 ? "Blue Team" : "Red Team"}</div>
      <div className="text-16 font-medium mb-2">
        <span>Members: </span>
        {teamPlayers.map((player, i) => (
          <React.Fragment key={i}>
            {i !== 0 && ", "}
            <span className={clsx(player.cluegiver ? "font-bold" : "opacity-80")}>{player.name}</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

function Words() {
  const { team, self } = useGameBoardContext()
  const words = ["PERSONNEL", "APPREHENSION", "BUFFALO", "APE"]

  return (
    <div
      className={clsx(
        "flex flex-1 divide-x-4 divide-opacity-50 p-0",
        team === 0 ? "panel-blue divide-blue-900" : "panel-red divide-red-900"
      )}
    >
      {words.map((word, i) => (
        <div key={i} className="flex flex-col items-center justify-center w-1/4 py-4">
          <div className="font-bold text-20">#{i + 1}</div>
          <div className="font-bold text-gray-400">{word}</div>
        </div>
      ))}
    </div>
  )
}

function ClueInputs() {
  const { team, self } = useGameBoardContext()
  let words = ["PERSONNEL", "APPREHENSION", "BUFFALO", "APE"]
  const numbers = [3, 2, 1]

  return (
    <div>
      <div className="mb-2 font-medium text-20 text-gray-300">It's your turn to give clues!</div>
      <div className={clsx("p-4 pb-2 space-y-2", team === 0 ? "panel-blue" : "panel-red")}>
        {numbers.map((number, i) => (
          <div key={i} className="flex items-center">
            <div className="font-medium text-18 w-6">#{number}</div>
            <div className="font-medium text-18 text-gray-400 w-32 mr-4">{words[number - 1]}</div>
            <div className="input-container flex-1">
              <input className="input flex-1" placeholder={`Enter a clue for ${words[number - 1]}`} />
            </div>
          </div>
        ))}
        <div className="flex justify-center">
          <button className={team === 0 ? "btn" : "btn btn-red"}>Submit Clues</button>
        </div>
      </div>
    </div>
  )
}

function GuessInputs() {
  const { team, self } = useGameBoardContext()
  let clues = ["COW", "CAUGHT", "WORKER"]

  return (
    <div>
      <div className="mb-2 font-medium text-20 text-gray-300">
        Guess {team === self.team ? "your team's" : "the opposing team's"} clues!
      </div>
      <div className={clsx("p-4 pb-2 space-y-2", team === 0 ? "panel-blue" : "panel-red")}>
        {[1, 2, 3].map((number, i) => (
          <div className="flex items-center">
            <div className="flex items-center h-7 flex-1 bg-gray-750 px-2 font-medium text-18 text-gray-300 mr-4">
              {clues[number - 1]}
            </div>
            <GuessInput key={i} initialNumber={number} />
          </div>
        ))}
        <div className="flex justify-center">
          <button className={team === 0 ? "btn" : "btn btn-red"}>Submit Guesses</button>
        </div>
      </div>
    </div>
  )
}

function GuessInput({ initialNumber }) {
  const { team, self } = useGameBoardContext()
  let words = ["PERSONNEL", "APPREHENSION", "BUFFALO", "APE"]

  const [selectedNumber, setSelectedNumber] = useState(initialNumber)
  const word = team === self.team ? words[selectedNumber - 1] : "????????"

  return (
    <button className="flex items-center text-left bg-gray-750 px-2 rounded hover:bg-gray-700 active:bg-gray-750">
      <div className="font-medium text-18 w-6">#{selectedNumber}</div>
      <div className="font-medium text-18 text-gray-400 w-32">{word}</div>
    </button>
  )
}

function RoundHistory() {
  const { team, self } = useGameBoardContext()
  const rounds = [
    {
      roundNum: 1,
      team: team,
      clues: ["COW", "CAUGHT", "WORKER"],
      ours: [3, 2, 1],
      theirs: [1, 2, 3],
      correct: [3, 2, 1],
    },
    {
      roundNum: 2,
      team: team,
      clues: ["BEEF", "CRIMINAL", "HR"],
      ours: [3, 2, 1],
      theirs: [1, 2, 3],
      correct: [3, 2, 1],
    },
  ]

  return (
    <div
      className={clsx(
        "divide-y-4 divide-opacity-50 p-0",
        team === 0 ? "panel-blue divide-blue-900" : "panel-red divide-red-900"
      )}
    >
      {rounds.map((round, i) => (
        <Round round={round} key={i} />
      ))}
    </div>
  )
}

const classLoad = ["border-blue-700", "border-red-700", "text-blue-500", "text-red-500"]
function Round({ round }) {
  const { team, self } = useGameBoardContext()
  const { roundNum, clues, ours, theirs, correct } = round
  const ourColor = team === 0 ? "blue" : "red"
  const theirColor = team === 0 ? "red" : "blue"

  return (
    <div className="flex items-center p-4">
      <div className="w-16 mr-4">Round {roundNum}</div>
      <div className="flex-1 space-y-1">
        {[0, 1, 2].map((i) => (
          <div className="flex">
            <div className="flex-1 font-medium text-18 text-gray-300 h-6 bg-gray-750 mr-4 px-2">{clues[i]}</div>
            <div className={clsx("border w-6 h-6 flex-center mr-1", `border-${theirColor}-700 text-${theirColor}-500`)}>
              <span className="h-full">{theirs[i]}</span>
            </div>
            <div className={clsx("border w-6 h-6 flex-center mr-1", `border-${ourColor}-700 text-${ourColor}-500`)}>
              <span className="height-0">{ours[i]}</span>
            </div>
            <div className={clsx("border w-6 h-6 flex-center", `border-gray-600 text-gray-300`)}>
              <span className="h-full">{correct[i]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ClueHistory() {
  const { team, self } = useGameBoardContext()
  const rounds = [
    {
      roundNum: 1,
      team: team,
      clues: ["COW", "CAUGHT", "WORKER"],
      ours: [3, 2, 1],
      theirs: [1, 2, 3],
      correct: [3, 2, 1],
    },
    {
      roundNum: 2,
      team: team,
      clues: ["BEEF", "CRIMINAL", "HR"],
      ours: [3, 2, 1],
      theirs: [1, 2, 3],
      correct: [3, 2, 1],
    },
  ]

  return (
    <div
      className={clsx(
        "flex flex-1 divide-x-4 divide-opacity-50 p-0",
        team === 0 ? "panel-blue divide-blue-900" : "panel-red divide-red-900"
      )}
    >
      {words.map((word, i) => (
        <div key={i} className="flex flex-col items-center justify-center w-1/4 py-4">
          <div className="font-bold text-20">#{i + 1}</div>
          <div className="font-bold text-gray-400">{word}</div>
        </div>
      ))}
    </div>
  )
}
