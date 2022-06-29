import { enhance, state } from "../redux/redux2"

export const doSubmitClues = enhance("submitClues", function submitClues(clues, team) {
  const round = state.rounds[team].last
  if (round.cluesSubmitted) return

  round.clues = clues
  round.cluesSubmitted = true
})

export const doSetGuesses = enhance("setGuesses", function setGuesses({ theirs, ours }, team) {
  const round = state.rounds[team].last
  if (!round.theirsSubmitted) {
    round.theirs = theirs
  }
  if (!round.oursSubmitted) {
    round.ours = ours
  }
})

export const doIncrementGuess = enhance("incrementGuess", function incrementGuess(key, index, team) {
  const round = state.rounds[team].last
  if (round[`${key}Submitted`]) return
  round[key][index] = (round[key][index] % 4) + 1
})

export const doSubmitTheirs = enhance("submitTheirs", function submitTheirs(team) {
  const round = state.rounds[team].last
  round.theirsSubmitted = true
})

export const doSubmitOurs = enhance("submitOurs", function submitOurs(team) {
  const round = state.rounds[team].last
  round.oursSubmitted = true
})
