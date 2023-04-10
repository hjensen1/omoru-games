import { every, shuffle } from "lodash"
import actions from "../cauldron/actions"
import { cauldron } from "../cauldron/cauldron"
import { state } from "../cauldron/state"
import { hostId } from "../peerjsMiddleware/hostId"
import { peerId } from "../peerjsMiddleware/peerId"
import { otherTeam } from "./cauldron/gameMeta"
import { wordList } from "./wordList"

export function generateRound(rounds, players, team, corrects) {
  let roundNum = 1
  if (rounds.length > 0) {
    team = rounds.last.team
    roundNum = rounds.length + 1
  }
  return {
    roundNum,
    team,
    cluegiver: players[(roundNum - 1) % players.length],
    correct: corrects.pop(),
    clues: ["", "", ""],
    theirs: roundNum === 1 ? [null, null, null] : [1, 2, 3],
    ours: [1, 2, 3],
    cluesSubmitted: false,
    theirsSubmitted: roundNum === 1,
    oursSubmitted: false,
    theirsRevealed: false,
    oursRevealed: false,
    correctRevealed: false,
  }
}

export function startGame() {
  if (peerId !== hostId) return

  // To ensure synchronization of randomly generated details,
  // setup in host then send full state to clients.
  doStartGame()
  actions.doSetFullState(cauldron.getState())
}

actions.doStartGame = function () {
  console.log(peerId, hostId)
  // To ensure synchronization of randomly generated details,
  // setup in host then send full state to clients.
  if (peerId !== hostId) return

  const shuffled = shuffle(wordList)
  state.teams[0] = shuffle(state.teams[0])
  state.teams[1] = shuffle(state.teams[1])
  state.words[0] = shuffled.slice(0, 4)
  state.words[1] = shuffled.slice(4, 8)
  state.corrects = []
  for (let i = 0; i < 20; i++) {
    state.corrects.push(shuffle([1, 2, 3, 4]).slice(0, 3))
  }
  state.score = [
    { interceptions: 0, miscommunications: 0 },
    { interceptions: 0, miscommunications: 0 },
  ]
  doStartRound()
}

actions.doStartRound = function () {
  const { rounds, corrects } = state
  rounds[0].push(generateRound(rounds[0], state.teams[0], 0, corrects))
  rounds[1].push(generateRound(rounds[1], state.teams[1], 1, corrects))
}

function delay(duration) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), duration)
  })
}

let endingRound = false
export async function endRound() {
  if (endingRound) return
  if (peerId !== hostId) return
  if (!canEndRound(cauldron.getState())) return
  endingRound = true

  await delay(1000)
  doSetRevealState("theirsRevealed", 0)
  await delay(1500)
  doSetRevealState("oursRevealed", 0)
  await delay(1500)
  doSetRevealState("correctRevealed", 0)
  await delay(1500)
  doSetRevealState("theirsRevealed", 1)
  await delay(1500)
  doSetRevealState("oursRevealed", 1)
  await delay(1500)
  doSetRevealState("correctRevealed", 1)
  await delay(2000)

  if (isGameOver(cauldron.getState())) {
    // endGame()
  } else {
    doStartRound()
    endingRound = false
  }
}

function canEndRound(state) {
  if (!state.rounds[0] || !state.rounds[1]) return false
  const lastRounds = [state.rounds[0].last, state.rounds[1].last]
  return every(lastRounds, (round) => round && round.cluesSubmitted && round.theirsSubmitted && round.oursSubmitted)
}

actions.doSetRevealState = function setRevealState(key, team) {
  const round = state.rounds[team].last
  if (!round[key]) {
    round[key] = true
    if (key === "correctRevealed") {
      doScoreRound(team)
    }
  }
}

actions.doScoreRound = function scoreRound(team) {
  const round = state.rounds[team].last
  if (JSON.stringify(round.theirs) === JSON.stringify(round.correct)) {
    state.score[otherTeam(team)].interceptions += 1
  } else if (JSON.stringify(round.ours) !== JSON.stringify(round.correct)) {
    state.score[team].miscommunications += 1
  }
}

function isGameOver(state) {
  return (
    state.score[0].interceptions >= 2 ||
    state.score[1].interceptions >= 2 ||
    state.score[0].miscommunications >= 2 ||
    state.score[1].miscommunications >= 2 ||
    (state.rounds[1].length === 8 && state.rounds[1].last.correctRevealed)
  )
}

const { doStartGame, doStartRound, doSetRevealState, doScoreRound } = actions
