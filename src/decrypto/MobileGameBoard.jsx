import clsx from "clsx"
import React, { createContext, useContext, useEffect, useMemo } from "react"
import { useState } from "react"
import { useSelector } from "react-redux"
import { doAddToTeam, otherTeam } from "./cauldron/gameMeta"
import { doIncrementGuess, doSubmitClues, doSubmitOurs, doSubmitTheirs } from "./playerActions"
import CheckIcon from "../images/check.svg?component"
import XIcon from "../images/close.svg?component"
import { peerId } from "../peerjsMiddleware/peerId"
import { hostId } from "../peerjsMiddleware/hostId"
import TurnEnder from "./TurnEnder"
import textFit from "textfit"

export function MobileGame({ self, startGame, canStartGame }) {
  const [activeTab, setActiveTab] = useState("Overview")

  return (
    <div className="flex flex-col w-full h-full">
      <MobileGameTabs self={self} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex flex-col h-full w-full py-3 overflow-auto" id="scroll-container">
        <Overview self={self} startGame={startGame} canStartGame={canStartGame} active={activeTab === "Overview"} />
        <MobileGameBoard self={self} team={0} active={activeTab === "Blue Team"} setActiveTab={setActiveTab} />
        <MobileGameBoard self={self} team={1} active={activeTab === "Red Team"} setActiveTab={setActiveTab} />
        <TurnEnder />
      </div>
    </div>
  )
}

function MobileGameTabs({ activeTab, setActiveTab, self }) {
  const gameStarted = useSelector((state) => !!state.rounds[0][0])

  const blueTeamTab = (
    <button
      key="0"
      className={clsx(
        "text-13 font-medium text-gray-300 font-medium px-1 py-0.5 rounded border-2",
        activeTab === "Blue Team" ? "border-gray-600" : "border-transparent"
      )}
      onClick={() => gameStarted && setActiveTab("Blue Team")}
    >
      {self.team === 0 ? "Your Team" : "Opponents"}
    </button>
  )
  const redTeamTab = (
    <button
      key="1"
      className={clsx(
        "text-13 font-medium text-gray-300 font-medium px-1 py-0.5 rounded border-2",
        activeTab === "Red Team" ? "border-gray-600" : "border-transparent"
      )}
      onClick={() => gameStarted && setActiveTab("Red Team")}
    >
      {self.team === 1 ? "Your Team" : "Opponents"}
    </button>
  )
  const teamTabs = self.team === 0 ? [blueTeamTab, redTeamTab] : [redTeamTab, blueTeamTab]
  return (
    <div className="h-8 w-full flex items-center bg-gray-800 border-b border-gray-600 space-x-0.5 px-2">
      {teamTabs}
      <button
        className={clsx(
          "text-13 font-medium text-gray-300 font-medium px-1 py-0.5 rounded border-2",
          activeTab === "Overview" ? "border-gray-600" : "border-transparent"
        )}
        onClick={() => setActiveTab("Overview")}
      >
        Overview
      </button>
      <div className="text-gray-300 text-14 font-bold pl-1">Game ID: {hostId}</div>
    </div>
  )
}

function Overview({ self, startGame, canStartGame, active }) {
  return (
    <div className={clsx("w-full h-full flex flex-col items-center space-y-4", !active && "hidden")}>
      {hostId === peerId && canStartGame && (
        <button className="btn flex-0 w-32" onClick={startGame}>
          Start Game
        </button>
      )}
      <OverviewPanel self={self} team={0} />
      <OverviewPanel self={self} team={1} />
    </div>
  )
}

function OverviewPanel({ self, team }) {
  const players = useSelector((state) => state.players)
  const teamPlayers = players.filter((player) => player.team === team)
  const cluegiver = useSelector((state) => state.rounds[team].last?.cluegiver)
  const score = useSelector((state) => state.score[team])
  const gameStarted = useSelector((state) => !!state.rounds[0][0])

  return (
    <div className={clsx("w-full flex-1", team === 0 ? "panel-blue-mobile" : "panel-red-mobile")}>
      <div className="flex justify-between items-center">
        <div className="mb-1 text-20 font-medium">{team === 0 ? "Blue Team" : "Red Team"}</div>
        {gameStarted && self.team != null ? (
          <div className="flex flex-col items-start">
            <div className="flex-center text-16 opacity-80">
              <CheckIcon className="fill-current h-5 w-5 p-0.5 mr-1" />
              Interceptions: <span className="opacity-100 font-bold ml-0.5">{score.interceptions}</span>
            </div>
            <div className="flex-center text-16 opacity-80">
              <XIcon className="fill-current h-5 w-5 mr-1" />
              Miscommunications: <span className="opacity-100 font-bold ml-0.5">{score.miscommunications}</span>
            </div>
          </div>
        ) : (
          self.team !== team && (
            <button className={clsx("btn", team === 1 && "btn-red")} onClick={() => doAddToTeam(peerId, team)}>
              Join Team
            </button>
          )
        )}
      </div>
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

const GameBoardContext = createContext({})
function useGameBoardContext() {
  return useContext(GameBoardContext)
}

export default function MobileGameBoard({ team, self, active, setActiveTab }) {
  const contextData = useMemo(
    () => ({
      team,
      self,
      active,
      setActiveTab,
    }),
    [team, self, active, setActiveTab]
  )
  const roundNum = useSelector((state) => state.rounds[team].length)

  return (
    <GameBoardContext.Provider value={contextData}>
      <div className={clsx("w-full space-y-3", !active && "hidden")}>
        {self.team != null && (
          <>
            {/* <Words /> */}
            <RoundHistory />
            <ClueHistory />
            <ClueInputs key={`ClueInputs${roundNum}`} />
            <GuessInputs key={`GuessInputs${roundNum}`} />
            <OtherTeamGuessStatus key={`OtherTeamGuessStatus${roundNum}`} />
          </>
        )}
      </div>
    </GameBoardContext.Provider>
  )
}

const otherTeamWords = ["????", "????", "????", "????"]
function Words() {
  const { team, self, active } = useGameBoardContext()
  const words = useSelector((state) => state.words[team])

  const [word1El, setWord1El] = useState(null)
  const [word2El, setWord2El] = useState(null)
  const [word3El, setWord3El] = useState(null)
  const [word4El, setWord4El] = useState(null)
  const wordEls = [word1El, word2El, word3El, word4El]
  const wordElSetters = [setWord1El, setWord2El, setWord3El, setWord4El]
  useEffect(() => {
    for (const wordEl of wordEls) {
      if (wordEl && active) {
        textFit(wordEl, { minFontSize: 9, maxFontSize: 12 })
      }
    }
  }, [...wordEls, active])

  const gameStarted = useSelector((state) => !!state.rounds[0][0])
  if (!gameStarted) return null

  return (
    <div
      className={clsx(
        "flex flex-1 divide-x-4 divide-opacity-50 p-0",
        team === 0 ? "panel-blue-mobile divide-blue-900" : "panel-red-mobile divide-red-900"
      )}
    >
      {(self.team === team ? words : otherTeamWords).map((word, i) => (
        <div key={i} className="flex flex-col items-center justify-center w-1/4 py-1">
          <div className="font-bold text-16">#{i + 1}</div>
          <div className="font-bold text-gray-400 text-12 -mt-1 w-full text-center" ref={wordElSetters[i]}>
            {word}
          </div>
        </div>
      ))}
    </div>
  )
}

function ClueInputs() {
  const { team, self, setActiveTab } = useGameBoardContext()
  const players = useSelector((state) => state.players)
  const round = useSelector((state) => state.rounds[team].last)
  const words = useSelector((state) => state.words[team])
  const [clues, setClues] = useState(["", "", ""])

  useEffect(() => {
    if (round && round.cluegiver === self.id) {
      setActiveTab(team === 0 ? "Blue Team" : "Red Team")
      const el = document.getElementById("scroll-container")
      setTimeout(() => el.scrollTo(0, el.scrollHeight), 50)
    }
  }, [round?.cluegiver, round?.cluesSubmitted])

  if (!round || round.cluesSubmitted) return null

  if (round.cluegiver !== self.id) {
    const cluegiver = players.find((player) => player.id === round.cluegiver)
    return (
      <div className="mb-1 font-medium text-16 text-gray-300 w-full text-center">
        <span className="font-bold">{cluegiver.name}</span> is giving clues
      </div>
    )
  }

  const { correct } = round

  return (
    <div>
      <div className="mb-1 font-medium text-16 text-gray-300 w-full text-center">It's your turn to give clues!</div>
      <div className={clsx("p-2 space-y-2", team === 0 ? "panel-blue-mobile" : "panel-red-mobile")}>
        {correct.map((number, i) => (
          <div key={i} className="flex flex-col w-full">
            <div className="flex">
              <div className="font-medium text-16 w-6">#{number}</div>
              <div className="font-medium text-16 text-gray-400 w-32 mr-4">{words[number - 1]}</div>
            </div>
            <div className="input-container flex-1">
              <input
                className="input flex-1 uppercase"
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
  const playerCount = useSelector((state) => state.players.length)
  if (!round || !round.cluesSubmitted) return null
  if (self.team !== team && round.roundNum === 1) return null

  const { clues } = round
  const key = self.team === team ? "ours" : "theirs"
  const submit = self.team === team ? doSubmitOurs : doSubmitTheirs
  const isSubmitted = self.team === team ? round.oursSubmitted : round.theirsSubmitted
  const guesses = round[key]
  const disabled = round.cluegiver === self.id && round.turnOrder.length > 1

  return (
    <div>
      {isSubmitted ? (
        <div className="mb-1 font-medium text-16 text-gray-300 w-full text-center">Guesses submitted!</div>
      ) : disabled ? (
        <div className="mb-1 font-medium text-16 text-gray-300 w-full text-center">
          Your team is guessing your clues...
        </div>
      ) : (
        <div className="mb-1 font-medium text-16 text-gray-300 w-full text-center">
          Guess {team === self.team ? "your team's" : "the opposing team's"} clues!
        </div>
      )}
      <div className={clsx("p-2 space-y-2", team === 0 ? "panel-blue-mobile" : "panel-red-mobile")}>
        {clues.map((clue, i) => (
          <div key={i} className="flex flex-col">
            <div className="w-full text-center flex-1 bg-gray-800 px-2 py-0 font-medium text-18 text-gray-300 mb-1">
              {clue}
            </div>
            <GuessInput
              key={i}
              value={guesses[i]}
              onChange={() => doIncrementGuess(key, i, team)}
              disabled={disabled}
            />
          </div>
        ))}
        {!isSubmitted && (
          <div className="flex justify-center">
            <button className={team === 0 ? "btn" : "btn btn-red"} onClick={() => submit(team)} disabled={disabled}>
              Submit Guesses
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function GuessInput({ value, onChange, disabled }) {
  const { team, self } = useGameBoardContext()
  const words = useSelector((state) => state.words[team])
  const word = team === self.team ? words[value - 1] : "????????"

  return (
    <button
      className="flex items-center justify-center w-full bg-gray-750 px-2 rounded hover:bg-gray-700 active:bg-gray-750"
      onClick={onChange}
      disabled={disabled}
    >
      <div className="font-medium text-18 w-6 mr-1">#{value}</div>
      <div className="font-medium text-18 text-gray-400">{word}</div>
    </button>
  )
}

function RoundHistory() {
  const { team, self } = useGameBoardContext()
  const rounds = useSelector((state) => state.rounds[team])
  const completedRounds = rounds.filter((round) => round.theirsRevealed)
  const lastRound = completedRounds.pop()
  const [expanded, setExpanded] = useState(1)

  if (!lastRound) return null
  return (
    <div
      className={clsx(
        "divide-y-4 divide-opacity-50 p-0 relative cursor-pointer",
        team === 0 ? "panel-blue-mobile divide-blue-900" : "panel-red-mobile divide-red-900"
      )}
      // onClick={() => setExpanded((expanded + 2) % 3)}
      onClick={() => setExpanded(expanded === 1 ? 2 : 1)}
    >
      {expanded === 0 && <div className="text-16 font-medium w-full text-center">Round {rounds.length} Results</div>}
      {expanded === 2 && completedRounds.map((round, i) => <Round round={round} key={i} />)}
      {expanded !== 0 && <Round key={completedRounds.length} round={lastRound} />}
    </div>
  )
}

const classLoad = ["border-blue-700", "border-red-700", "text-blue-500", "text-red-500"]
function Round({ round }) {
  const { team, self, setActiveTab } = useGameBoardContext()
  const { roundNum, clues, ours, theirs, correct, theirsRevealed, oursRevealed, correctRevealed } = round
  const ourColor = team === 0 ? "blue" : "red"
  const theirColor = team === 0 ? "red" : "blue"
  const [el, setEl] = useState(null)

  useEffect(() => {
    console.log(team === 0 ? "Blue Team" : "Red Team")
    setActiveTab(team === 0 ? "Blue Team" : "Red Team")
    setTimeout(() => el.scrollIntoView(), 50)
  }, [el])

  return (
    <div ref={setEl} className="flex flex-col justify-center items-center p-2 pt-0.5">
      <div className="text-16 font-medium">Round {roundNum} Results</div>
      <div className="w-full space-y-1">
        {[0, 1, 2].map((i) => (
          <div className="flex w-full" key={i}>
            <div className="flex-1 font-medium text-16 text-gray-400 bg-gray-750 mr-2 px-2">{clues[i]}</div>
            <div
              className={clsx(
                "w-6 h-6 flex-center mr-1 text-16",
                `border-${theirColor}-700 text-${theirColor}-500`,
                theirs[i] === correct[i] ? "border-2" : "border"
              )}
            >
              {theirsRevealed && <span className="">{theirs[i]}</span>}
            </div>
            <div
              className={clsx(
                "w-6 h-6 flex-center mr-1 text-16",
                `border-${ourColor}-700 text-${ourColor}-500`,
                ours[i] === correct[i] ? "border-2" : "border"
              )}
            >
              {oursRevealed && <span className="">{ours[i]}</span>}
            </div>
            <div className={clsx("border w-6 h-6 flex-center text-16", `border-gray-600 text-gray-300`)}>
              {correctRevealed && <span className="">{correct[i]}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ClueHistory() {
  const { team } = useGameBoardContext()

  return (
    <div
      className={clsx(
        "p-0 divide-y-4 divide-opacity-50",
        team === 0 ? "panel-blue-mobile divide-blue-900" : "panel-red-mobile divide-red-900"
      )}
    >
      {[1, 2, 3, 4].map((wordIndex, i) => (
        <ClueHistoryRow key={i} wordIndex={wordIndex} />
      ))}
    </div>
  )
}

function ClueHistoryRow({ wordIndex, className }) {
  const { team, self } = useGameBoardContext()
  let word = useSelector((state) => state.words[team][wordIndex - 1])
  if (self.team !== team) word = otherTeamWords[wordIndex - 1]
  // if (self.team !== team) word = "ADMINISTRATION"
  const rounds = useSelector((state) => state.rounds[team])
  const completedRounds = rounds.filter((round) => round.correctRevealed)
  const relevantClues = []
  for (const round of completedRounds) {
    for (let i = 0; i < 3; i++) {
      const correct = round.correct[i]
      if (correct === wordIndex) {
        relevantClues.push(
          <div
            key={relevantClues.length}
            className={clsx(
              "text-14 text-gray-400 font-medium text-center",
              // Highlight if other team missed their own clue
              self.team !== team && round.ours[i] !== round.correct[i] && "italic",
              // Highlight if other team correctly guessed your team's clue
              self.team === team && round.theirs[i] === round.correct[i] && "italic"
            )}
            style={{ lineHeight: "16px" }}
          >
            {round.clues[i]}
          </div>
        )
      }
    }
  }

  return (
    <div className={clsx("flex divide-x-4 divide-opacity-50", team === 0 ? "divide-blue-900" : "divide-red-900")}>
      <div className="flex flex-col items-center justify-center py-1">
        <div className="font-bold text-16">#{wordIndex}</div>
        <div className="font-bold text-gray-400 text-12 -mt-1 w-28 text-center">{word}</div>
      </div>
      <div className={clsx("flex flex-1 flex-col items-center justify-center p-0.5")}>{relevantClues}</div>
    </div>
  )
}

function OtherTeamGuessStatus() {
  const { team, self } = useGameBoardContext()
  const otherTeam = (self.team + 1) % 2
  const ourRound = useSelector((state) => state.rounds[self.team].last)
  const theirRound = useSelector((state) => state.rounds[otherTeam].last)

  let text
  if (!ourRound) {
    return null
  } else if (team === otherTeam && theirRound.oursSubmitted) {
    text = "The opposing team has guessed their clues."
  } else if (team == self.team && ourRound.theirsSubmitted && ourRound.roundNum > 1) {
    text = "The opposing team has guessed your clues."
  } else {
    return null
  }

  return <div className="w-full text-center text-18 font-medium text-gray-400">{text}</div>
}
