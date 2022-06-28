import clsx from "clsx"
import { capitalize } from "lodash"
import React, { createContext, useContext, useMemo } from "react"
import { useState } from "react"
import { useSelector } from "react-redux"
import { doIncrementGuess, doSetGuesses, doSubmitClues, doSubmitOurs, doSubmitTheirs } from "./playerActions"

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
        <ClueHistory />
        <RoundHistory />
        <ClueInputs />
        <GuessInputs />
      </div>
    </GameBoardContext.Provider>
  )
}

function TeamMembers() {
  const { team, self } = useGameBoardContext()
  const players = useSelector((state) => state.players)
  const teamPlayers = players.filter((player) => player.team === team)
  const cluegiver = useSelector((state) => state.rounds[team].last?.cluegiver)

  return (
    <div className={clsx("w-[40rem] ", team === 0 ? "panel-blue" : "panel-red")}>
      <div className="mb-1 text-20 font-medium">{team === 0 ? "Blue Team" : "Red Team"}</div>
      <div className="text-16 font-medium mb-2">
        <span>Members: </span>
        {teamPlayers.map((player, i) => (
          <React.Fragment key={i}>
            {i !== 0 && ", "}
            <span className={clsx(player.id === cluegiver ? "font-bold" : "opacity-80")}>{player.name}</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

const otherTeamWords = ["????", "????", "????", "????"]
function Words() {
  const { team, self } = useGameBoardContext()
  const words = useSelector((state) => state.words[team])

  return (
    <div
      className={clsx(
        "flex flex-1 divide-x-4 divide-opacity-50 p-0",
        team === 0 ? "panel-blue divide-blue-900" : "panel-red divide-red-900"
      )}
    >
      {(self.team === team ? words : otherTeamWords).map((word, i) => (
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
  const round = useSelector((state) => state.rounds[team].last)
  const words = useSelector((state) => state.words[team])
  const [clues, setClues] = useState(["", "", ""])
  if (!round || round.cluegiver !== self.id || round.cluesSubmitted) return null

  const { correct } = round

  return (
    <div>
      <div className="mb-2 font-medium text-20 text-gray-300">It's your turn to give clues!</div>
      <div className={clsx("p-4 pb-2 space-y-2", team === 0 ? "panel-blue" : "panel-red")}>
        {correct.map((number, i) => (
          <div key={i} className="flex items-center">
            <div className="font-medium text-18 w-6">#{number}</div>
            <div className="font-medium text-18 text-gray-400 w-32 mr-4">{words[number - 1]}</div>
            <div className="input-container flex-1">
              <input
                className="input flex-1"
                placeholder={`Enter a clue for ${words[number - 1]}`}
                value={clues[i]}
                onChange={(e) => {
                  const a = [...clues]
                  a[i] = e.target.value
                  setClues(a)
                }}
              />
            </div>
          </div>
        ))}
        <div className="flex justify-center">
          <button className={team === 0 ? "btn" : "btn btn-red"} onClick={() => doSubmitClues(clues, team)}>
            Submit Clues
          </button>
        </div>
      </div>
    </div>
  )
}

function GuessInputs() {
  const { team, self } = useGameBoardContext()
  const round = useSelector((state) => state.rounds[team].last)
  if (!round || !round.cluesSubmitted) return null
  if (self.team !== team && round.roundNum === 1) return null

  const { clues } = round
  const key = self.team === team ? "ours" : "theirs"
  const submit = self.team === team ? doSubmitOurs : doSubmitTheirs
  const isSubmitted = self.team === team ? round.oursSubmitted : round.theirsSubmitted
  const guesses = round[key]

  return (
    <div>
      {isSubmitted ? (
        <div className="mb-2 font-medium text-20 text-gray-300">Clues submitted</div>
      ) : (
        <div className="mb-2 font-medium text-20 text-gray-300">
          Guess {team === self.team ? "your team's" : "the opposing team's"} clues!
        </div>
      )}
      <div className={clsx("p-4 space-y-2", team === 0 ? "panel-blue" : "panel-red", !isSubmitted && "pb-2")}>
        {clues.map((clue, i) => (
          <div key={i} className="flex items-center">
            <div className="flex items-center h-7 flex-1 bg-gray-750 px-2 font-medium text-18 text-gray-300 mr-4">
              {clue}
            </div>
            <GuessInput key={i} value={guesses[i]} onChange={() => doIncrementGuess(key, i, team)} />
          </div>
        ))}
        {!isSubmitted && (
          <div className="flex justify-center">
            <button className={team === 0 ? "btn" : "btn btn-red"} onClick={() => submit(team)}>
              Submit Guesses
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function GuessInput({ value, onChange }) {
  const { team, self } = useGameBoardContext()
  const words = useSelector((state) => state.words[team])
  const word = team === self.team ? words[value - 1] : "????????"

  return (
    <button
      className="flex items-center text-left bg-gray-750 px-2 rounded hover:bg-gray-700 active:bg-gray-750"
      onClick={onChange}
    >
      <div className="font-medium text-18 w-6">#{value}</div>
      <div className="font-medium text-18 text-gray-400 w-32">{word}</div>
    </button>
  )
}

function RoundHistory() {
  const { team, self } = useGameBoardContext()
  const rounds = useSelector((state) => state.rounds[team])
  const completedRounds = rounds.filter((round) => round.theirsRevealed)

  if (completedRounds.length === 0) return null
  return (
    <div
      className={clsx(
        "divide-y-4 divide-opacity-50 p-0",
        team === 0 ? "panel-blue divide-blue-900" : "panel-red divide-red-900"
      )}
    >
      {completedRounds.map((round, i) => (
        <Round round={round} key={i} />
      ))}
    </div>
  )
}

const classLoad = ["border-blue-700", "border-red-700", "text-blue-500", "text-red-500"]
function Round({ round }) {
  const { team, self } = useGameBoardContext()
  const { roundNum, clues, ours, theirs, correct, theirsRevealed, oursRevealed, correctRevealed } = round
  const ourColor = team === 0 ? "blue" : "red"
  const theirColor = team === 0 ? "red" : "blue"

  return (
    <div className="flex items-center p-4">
      <div className="w-16 mr-4">Round {roundNum}</div>
      <div className="flex-1 space-y-1">
        {[0, 1, 2].map((i) => (
          <div className="flex" key={i}>
            <div className="flex-1 font-medium text-18 text-gray-300 h-6 bg-gray-750 mr-4 px-2">{clues[i]}</div>
            <div className={clsx("border w-6 h-6 flex-center mr-1", `border-${theirColor}-700 text-${theirColor}-500`)}>
              {theirsRevealed && <span className="">{theirs[i]}</span>}
            </div>
            <div className={clsx("border w-6 h-6 flex-center mr-1", `border-${ourColor}-700 text-${ourColor}-500`)}>
              {oursRevealed && <span className="">{ours[i]}</span>}
            </div>
            <div className={clsx("border w-6 h-6 flex-center", `border-gray-600 text-gray-300`)}>
              {correctRevealed && <span className="">{correct[i]}</span>}
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
  const clues = { 1: [], 2: [], 3: [], 4: [] }
  for (const round of rounds) {
    ;[0, 1, 2].forEach((i) => clues[round.correct[i]].push(round.clues[i]))
  }

  return (
    <div
      className={clsx(
        "flex flex-1 divide-x-4 divide-opacity-50 p-0",
        team === 0 ? "panel-blue divide-blue-900" : "panel-red divide-red-900"
      )}
    >
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex flex-col items-center w-1/4 py-4 px-2">
          {clues[i].map((clue, j) => (
            <div key={j} className="text-14 text-gray-400 font-medium">
              {clue}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
