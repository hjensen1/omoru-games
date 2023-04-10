import actions from "../../cauldron/actions"
import { state } from "../../cauldron/state"

export function otherTeam(team) {
  return (team + 1) % 2
}

actions.doAddPlayer = function (id, name) {
  if (!state.players.find((p) => p.id === id)) {
    state.players.push({ id, name })
    state.errors[id] = []
  }
}

actions.doAddToTeam = function (id, team) {
  if (state.teams[team].includes(id)) return

  const other = state.teams[otherTeam(team)]
  if (other.includes(id)) {
    const index = other.indexOf(id)
    other.splice(index, 1)
  }

  state.teams[team].push(id)
  state.players.find((p) => p.id === id).team = team
}

export const { doAddPlayer, doAddToTeam } = actions
