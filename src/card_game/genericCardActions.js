import { pull, shuffle } from "lodash"
import actions from "../cauldron/actions"
import { state } from "../cauldron/state"

actions.doRemoveCardFromZone = function ({ cardId, zoneId }) {
  pull(state.cardsByZoneId[zoneId], cardId)
}
export const { doRemoveCardFromZone } = actions

actions.doAddCardToZone = function ({ cardId, zoneId, index = null, orientation = null, rotation = 0 }) {
  const toCardList = state.cardsByZoneId[zoneId]
  if (index < 0 || index == null) {
    toCardList.push(cardId)
  } else {
    // TODO implement inserting at arbitrary index
  }

  const cardState = state.cardsState[cardId]
  const toZone = state.zones[zoneId]
  cardState.orientation = getCardOrientation(toZone, orientation)
  cardState.rotation = rotation
  cardState.zoneId = zoneId
}
export const { doAddCardToZone } = actions

actions.doSendCard = function ({ cardId, fromZoneId, toZoneId, index = null, orientation = null, rotation = 0 }) {
  doRemoveCardFromZone({ cardId, zoneId: fromZoneId })
  doAddCardToZone({ cardId, zoneId: toZoneId, index, orientation, rotation })
}
export const { doSendCard } = actions

function getCardOrientation(zone, orientation) {
  if (orientation) {
    return orientation
  } else if (zone.orientation === "face-up") {
    return "face-up"
  } else if (zone.orientation === "face-down") {
    return "face-down"
  } else if (zone.type === "deck") {
    return "face-down"
  } else {
    return "face-up"
  }
}

actions.doDealCard = function ({ fromZoneId, toZoneId, index = null, orientation = null, rotation = 0 }) {
  const cardId = state.cardsByZoneId[fromZoneId].last
  if (cardId != null) {
    doSendCard({
      cardId,
      fromZoneId,
      toZoneId,
      index,
      orientation,
      rotation,
    })
  }
}
export const { doDealCard } = actions

actions.doAddCardToGame = function ({ cardDisplay, zoneId, index = null, orientation = null, rotation = 0 }) {
  const id = cardDisplay.id
  state.cardsDisplay[id] = cardDisplay
  state.cardsState[id] = { id, orientation, rotation, zoneId }
  doAddCardToZone({ cardId: id, zoneId, index, orientation, rotation })
}
export const { doAddCardToGame } = actions

actions.doAddZoneToGame = function ({
  id,
  name = id,
  type,
  owner = null,
  top = 0,
  left = 0,
  width = 0,
  height = 0,
  justify = "center",
  rotation = 0,
  view = "face-up",
}) {
  state.zones[id] = { id, name, type, owner }
  state.zonesDisplay[id] = { top, left, width, height, justify, rotation, view }
  state.cardsByZoneId[id] = []
}
export const { doAddZoneToGame } = actions

actions.doShuffleDeck = function ({ zoneId }) {
  state.cardsByZoneId[zoneId] = shuffle(state.cardsByZoneId[zoneId])
}
export const { doShuffleDeck } = actions
