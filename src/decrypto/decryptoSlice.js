import { round } from "lodash"
import shuffle from "lodash/shuffle"
import { enhance, state } from "../redux/redux2"

export const initialState = {
  players: [{ id: "", name: "" }],
  teams: [[], []],
  wordList: [],
  cluegivers: [null, null],
  words: [null, null],
  rounds: [
    [
      {
        cluegiver: null,
        correct: [1, 2, 3],
        clues: ["", "", ""],
        guesses: [
          [1, 2, 3],
          [1, 2, 3],
        ],
      },
    ],
  ],
  score: [
    { interceptions: 0, misscommunications: 0 },
    { interceptions: 0, misscommunications: 0 },
  ],
  errors: {},
  suggestions: {},
}

export function otherTeam(team) {
  return (team + 1) % 2
}

export function joinGame(name) {
  doAddPlayer(window.peerId, name)
}

const doAddPlayer = enhance(function addPlayer(id, name) {
  if (!state.players.find((p) => p.id === id)) {
    state.players.push({ id, name })
    state.errors[id] = []
  }
})

export function joinTeam(team) {
  doAddToTeam(window.peerId, team)
}

const doAddToTeam = enhance(function addToTeam(id, team) {
  if (state.teams[team].includes(id)) {
    return
  }
  const other = state.teams[otherTeam(team)]
  if (other.includes(id)) {
    const index = other.indexOf(id)
    other.splice(index, 1)
  }

  state.teams[team].push(id)
  state.players.find((p) => p.id === id).team = team
})

export const doStartGame = enhance(function startGame() {
  const shuffled = shuffle(wordList)
  state.words[0] = [null, ...shuffled.slice(0, 4)]
  state.words[1] = [null, ...shuffled.slice(4, 8)]
  state.cluegivers = initialState.cluegivers
  state.rounds = initialState.rounds
  state.score = initialState.score
})

export const doStartRound = enhance(function startRound() {
  const { rounds } = state
  if (rounds.length === 0 || rounds.last.done) {
    rounds.push([
      {
        cluegiver: null,
        correct: shuffle([1, 2, 3, 4]).slice(0, 3),
        clues: null,
        ourGuesses: null,
        theirGuesses: null,
      },
      {
        cluegiver: null,
        correct: shuffle([1, 2, 3, 4]).slice(0, 3),
        clues: null,
        ourGuesses: null,
        theirGuesses: null,
      },
    ])
    state.suggestions = {}
    for (const { id } of players) {
      state.suggestions[id] = [
        [1, 2, 3],
        [1, 2, 3],
      ]
    }
  }
})

export function claimCluegiver() {
  doAssignCluegiver(window.peerId)
}

const doAssignCluegiver = enhance(function assignCluegiver(id) {
  if (!id) return
  const player = state.players.find((p) => p.id === id)
  if (state.cluegivers[player.team]) return
  state.cluegivers[player.team] = id
})

export function makeSuggestion(team, suggestions) {
  doSetSuggestions(id, team, suggestions)
}

const doSetSuggestions = enhance(function setSuggestions(id, team, suggestions) {
  state.suggestions[id][team] = suggestions
})

export const doSubmitGuesses = enhance(function submitGuesses(id, team) {
  const player = state.players.find((p) => p.id === id)
  if ((state.rounds.length === 0 && team !== player.id) || state.rounds.last[player.team].guesses[team]) {
    return // error
  }
  state.rounds.last[player.team].guesses[team] = state.suggestions
  // TODO score round
})
