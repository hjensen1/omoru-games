import { remove, shuffle } from "lodash"
import actions from "../../cauldron/actions"
import { state } from "../../cauldron/state"
import { useSelector } from "react-redux"
import { doAddPlayer, doSeatPlayer } from "./gameMeta"

actions.doSendCard = function ({ cardId, fromZoneId, toZoneId }) {
  const card = state.cards.find((c) => c.id === cardId)

  const fromList = state.cardsByZoneId[fromZoneId]
  remove(fromList, (c) => c.id === cardId)

  const toZone = state.cardsByZoneId[toZoneId]
  toZone.push(card)
  state.cardState[cardId].zoneId = toZoneId
}

export const { doSendCard } = actions

actions.doDrawCard = function (seatIndex) {
  const playerId = state.seats[seatIndex]
  const cardId = state.cardsByZoneId.deck.last.id
  const fromZoneId = "deck"
  const toZoneId = `hand-${playerId}`
  doSendCard({ cardId, fromZoneId, toZoneId })
}

export const { doDrawCard } = actions

actions.doDealCards = function () {
  ;[0, 1, 2, 3].forEach((seatIndex) => {
    if (state.seats[seatIndex]) {
      doDrawCard(seatIndex)
    }
  })
}

export const { doDealCards } = actions

actions.doInitTestGame = function () {
  doAddPlayer(peerId, "Hayden")
  doAddPlayer("player-2", "Player 2")
  doAddPlayer("player-3", "Player 3")
  doAddPlayer("player-4", "Player 4")
  doSeatPlayer(peerId, 0)
  doSeatPlayer("player-2", 1)
  doSeatPlayer("player-3", 2)
  doSeatPlayer("player-4", 3)
  shuffle(state.cardsByZoneId.deck)
  doDealCards()
}

export const { doInitTestGame } = actions

export function useZoneCards(zoneId) {
  return useSelector((state) => state.cardsByZoneId[zoneId])
}
