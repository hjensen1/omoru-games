import actions from "../../cauldron/actions"
import { state } from "../../cauldron/state"

actions.doAddPlayer = function (id, name) {
  if (!state.players.find((p) => p.id === id)) {
    state.players.push({ id, name })
  }
}

export const { doAddPlayer } = actions
