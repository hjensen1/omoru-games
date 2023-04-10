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

  if (state.rounds[team].length > 0) {
    state.rounds[team].last.turnOrder.unshift(id)
  }
}

actions.doRemoveFromTeam = function (id, team) {
  if (!state.teams[team].includes(id)) return

  delete state.players.find((p) => p.id === id).team
  const index = state.teams[team].indexOf(id)
  state.teams[team].splice(index, 1)

  if (state.rounds[team].length > 0) {
    const i = state.rounds[team].last.turnOrder.indexOf(id)
    state.rounds[team].last.turnOrder.splice(i, 1)
  }
}

actions.doRenamePlayer = function (id, name) {
  const player = state.players.find((p) => p.id === id)
  if (player) player.name = name
}

export const { doAddPlayer, doAddToTeam, doRemoveFromTeam } = actions
