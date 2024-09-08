import actions from "../cauldron/actions"
import { state } from "../cauldron/state"

actions.doSubmitClues = function submitClues(clues, team) {
  clues = clues.map((clue) => clue.toUpperCase())
  const allClues = state.rounds[team]
    .filter((round) => round.cluesSubmitted)
    .map((round) => round.clues)
    .flat()
    .concat(clues)
  console.log(allClues)
  if (new Set(allClues).size < allClues.length) return

  const round = state.rounds[team].last
  if (round.cluesSubmitted) return

  round.clues = clues
  round.cluesSubmitted = true
}

actions.doSetGuesses = function setGuesses({ theirs, ours }, team) {
  const round = state.rounds[team].last
  if (!round.theirsSubmitted) {
    round.theirs = theirs
  }
  if (!round.oursSubmitted) {
    round.ours = ours
  }
}

actions.doIncrementGuess = function incrementGuess(key, index, team) {
  const round = state.rounds[team].last
  if (round[`${key}Submitted`]) return
  round[key][index] = (round[key][index] % 4) + 1
}

actions.doSubmitTheirs = function submitTheirs(team) {
  const round = state.rounds[team].last
  const guesses = round.theirs
  if (new Set(guesses).size < 3) return
  round.theirsSubmitted = true
}

actions.doSubmitOurs = function submitOurs(team) {
  const round = state.rounds[team].last
  const guesses = round.ours
  if (new Set(guesses).size < 3) return
  round.oursSubmitted = true
}

export const { doSubmitClues, doSetGuesses, doIncrementGuess, doSubmitTheirs, doSubmitOurs } = actions
