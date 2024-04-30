import actions from "../cauldron/actions"
import { state } from "../cauldron/state"

actions.doArrangeCards = function () {
  for (const zoneId in state.zones) {
    doArrangeZoneCards(zoneId)
  }
  // TODO: Clean up cards not in any zone?
}
export const { doArrangeCards } = actions

actions.doArrangeZoneCards = function (zoneId) {
  const cardIds = state.cardsByZoneId[zoneId]
  const zone = state.zones[zoneId]
  const zoneDisplay = state.zonesDisplay[zoneId]
  const cardsState = cardIds.map((cardId) => state.cardsState[cardId])
  const cardsDisplay = cardIds.map((cardId) => state.cardsDisplay[cardId])
  if (zone.type === "deck") {
    doArrangeDeckCards(zone, zoneDisplay, cardsState, cardsDisplay)
  } else {
    doArrangeHandCards(zone, zoneDisplay, cardsState, cardsDisplay)
  }
}
const { doArrangeZoneCards } = actions

actions.doArrangeDeckCards = function (zone, zoneDisplay, cardsState, cardsDisplay) {
  // TODO allow hiding deck similar to hands, even if deck is faceup
  for (let i = 0; i < cardsState.length; i++) {
    const cardState = cardsState[i]
    const cardDisplay = cardsDisplay[i]
    set(cardDisplay, "top", zoneDisplay.top)
    set(cardDisplay, "left", zoneDisplay.left)
    const { width, height } = computeCardSize(zoneDisplay, state.cardSize)
    set(cardDisplay, "width", width)
    set(cardDisplay, "height", height)
    set(cardDisplay, "rotation", zoneDisplay.rotation + cardState.rotation)
    set(cardDisplay, "zIndex", i)
    set(cardDisplay, "view", cardState.orientation)
    set(cardDisplay, "visible", true)
  }
}
const { doArrangeDeckCards } = actions

actions.doArrangeHandCards = function (zone, zoneDisplay, cardsState, cardsDisplay) {
  for (let i = 0; i < cardsState.length; i++) {
    const cardState = cardsState[i]
    const cardDisplay = cardsDisplay[i]
    set(cardDisplay, "top", zoneDisplay.top)
    const { width, height } = computeCardSize(zoneDisplay, state.cardSize)
    set(
      cardDisplay,
      "left",
      zoneDisplay.left + computeLeft(zoneDisplay.width, width, zoneDisplay.justify, i, cardsState.length)
    )
    set(cardDisplay, "width", width)
    set(cardDisplay, "height", height)
    set(cardDisplay, "rotation", zoneDisplay.rotation + cardState.rotation)
    // Hand cards have higher z-index than deck cards.
    // Without this, cards dealt face-up from the deck may appear to be under the top face-down card.
    set(cardDisplay, "zIndex", 1000 + i)
    set(cardDisplay, "view", cardState.orientation)
    set(cardDisplay, "visible", true)
  }
}
const { doArrangeHandCards } = actions

function computeLeft(zoneWidth, cardWidth, justify, index, count) {
  const totalCardWidth = cardWidth * count
  const overlapCardWidth = count > 1 ? (zoneWidth - cardWidth) / (count - 1) : cardWidth
  if (totalCardWidth >= zoneWidth) {
    return overlapCardWidth * index
  } else if (justify === "left") {
    return cardWidth * index
  } else if (justify === "right") {
    return zoneWidth - totalCardWidth + cardWidth * index
  } else {
    // center
    return (zoneWidth - totalCardWidth) / 2 + cardWidth * index
  }
}

function computeCardSize(zoneDisplay, cardSize) {
  const widthRatio = zoneDisplay.width / cardSize.width
  const heightRatio = zoneDisplay.height / cardSize.height
  const ratio = Math.min(widthRatio, heightRatio, 1)
  return { width: cardSize.width * ratio, height: cardSize.height * ratio }
}

function set(object, key, value) {
  // Avoid copying objects if nothing would actually change.
  // TODO: test if immer already does this.
  if (object[key] !== value) object[key] = value
}
