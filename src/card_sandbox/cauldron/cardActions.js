import { remove } from "lodash"
import actions from "../../cauldron/actions"
import { state } from "../../cauldron/state"
import { useSelector } from "react-redux"

actions.doSendCard = function ({ cardId, fromZoneId, toZoneId }) {
  const card = state.cards.find((c) => c.id === cardId)

  const fromList = state.cardsByZoneId[fromZoneId]
  remove(fromList, (c) => c.id === cardId)

  const toZone = state.cardsByZoneId[toZoneId]
  toZone.push(card)
  state.cardState[cardId].zoneId = toZoneId
}

export const { doSendCard } = actions

export function useZoneCards(zoneId) {
  return useSelector((state) => state.cardsByZoneId[zoneId])
}
