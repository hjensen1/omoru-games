import { remove } from "lodash"
import actions from "../../cauldron/actions"
import { state } from "../../cauldron/state"

actions.doSendCard = function ({ cardId, fromZoneId, toZoneId }) {
  const fromZone = state.zones[fromZoneId]
  remove(fromZone.cards, (c) => c.id === cardId)

  const toZone = state.zones[toZoneId]
  const card = state.cards.find((c) => c.id === cardId)
  toZone.cards.push(card)
}

export const { doSendCard } = actions
