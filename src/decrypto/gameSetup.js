import { every, shuffle } from "lodash"
import { doSetFullState, enhance, getState, state } from "../redux/redux2"

export function generateRound(rounds, players, team, corrects) {
  let roundNum = 1
  if (rounds.length > 0) {
    team = rounds.last.team
    roundNum = rounds.length + 2
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
  if (!window.peerId === window.hostId) return

  doStartGame()
  doSetFullState(getState())
}

const wordList = ["a", "b", "c", "d", "e", "f", "g", "h", "i"]
export const doStartGame = enhance(function startGame() {
  if (!window.peerId === window.hostId) return
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
})

export const doStartRound = enhance(function startRound() {
  const { rounds, corrects } = state
  rounds[0].push(generateRound(rounds[0], state.teams[0], 0, corrects))
  rounds[1].push(generateRound(rounds[1], state.teams[1], 1, corrects))
})

function delay(duration) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), duration)
  })
}
let endingRound = false
export async function endRound() {
  if (!window.peerId === window.hostId) return
  if (!canEndRound(getState())) return
  if (endingRound) return
  endingRound = true

  await delay(1000)
  doSetRevealState("theirsRevealed", 0)
  await delay(1500)
  doSetRevealState("oursRevealed", 0)
  await delay(1500)
  doSetRevealState("correctRevealed", 0)
  await delay(3000)
  doSetRevealState("theirsRevealed", 1)
  await delay(1500)
  doSetRevealState("oursRevealed", 1)
  await delay(1500)
  doSetRevealState("correctRevealed", 1)
  await delay(3000)

  if (isGameOver()) {
    endGame()
  } else {
    doStartRound()
  }
  endingRound = false
}

function canEndRound(state) {
  const lastRounds = [state.rounds[0].last, state.rounds[1].last]
  return every(lastRounds, (round) => round && round.cluesSubmitted && round.theirsSubmitted && round.oursSubmitted)
}

const doSetRevealState = enhance(function setRevealState(key, team) {
  const round = state.rounds[team].last
  round[key] = true
})
