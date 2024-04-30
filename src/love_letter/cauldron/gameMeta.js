import actions from "../../cauldron/actions"
import { state } from "../../cauldron/state"
import { peerId } from "../../peerjsMiddleware/peerId"

actions.doAddPlayer = function (id, name) {
  if (!state.players.find((p) => p.id === id)) {
    state.players.push({ id, name })
  }
}

actions.doSeatPlayer = function (playerId, seatIndex) {
  state.seats[seatIndex] = playerId

  state.scores[playerId] = 0

  const handId = `hand-${playerId}`
  state.zones[handId] = {
    id: handId,
    type: "hand",
    owner: playerId,
  }
  state.cardsByZoneId[handId] = []

  const discardId = `discard-${playerId}`
  state.zones[discardId] = {
    id: discardId,
    type: "hand",
    owner: null,
  }
  state.cardsByZoneId[discardId] = []
}

export const { doAddPlayer, doSeatPlayer } = actions
