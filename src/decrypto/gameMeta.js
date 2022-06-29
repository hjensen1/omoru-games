import { enhance, state } from "../redux/redux2"

export function otherTeam(team) {
  return (team + 1) % 2
}

export function joinGame(name) {
  doAddPlayer(window.peerId, name)
}

const doAddPlayer = enhance("addPlayer", function addPlayer(id, name) {
  if (!state.players.find((p) => p.id === id)) {
    state.players.push({ id, name })
    state.errors[id] = []
  }
})

export function joinTeam(team) {
  doAddToTeam(window.peerId, team)
}

const doAddToTeam = enhance("addToTeam", function addToTeam(id, team) {
  if (state.teams[team].includes(id)) return

  const other = state.teams[otherTeam(team)]
  if (other.includes(id)) {
    const index = other.indexOf(id)
    other.splice(index, 1)
  }

  state.teams[team].push(id)
  state.players.find((p) => p.id === id).team = team
})
