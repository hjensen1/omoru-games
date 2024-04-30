import { doArrangeCards } from "../../card_game/arrangeCards"
import { doAddCardToGame, doAddZoneToGame, doSendCard } from "../../card_game/genericCardActions"
import { buildPlayingCardDeck } from "../../card_game/playingCardImages"
import actions from "../../cauldron/actions"
import { cauldron } from "../../cauldron/cauldron"

actions.doInitCardSandbox = function () {
  doAddZoneToGame({
    id: "zone1",
    type: "hand",
  })
  doAddZoneToGame({
    id: "zone2",
    type: "hand",
  })
  doAddZoneToGame({
    id: "deck1",
    type: "deck",
  })

  const cardsDisplay = buildPlayingCardDeck()
  for (const cardDisplay of cardsDisplay) {
    doAddCardToGame({
      cardDisplay,
      zoneId: "deck1",
    })
  }
  doArrangeCards()
}
export const { doInitCardSandbox } = actions

export function sandboxCardClicked(cardId) {
  const cardState = cauldron.getState().cardsState[cardId]
  const fromZoneId = cardState.zoneId
  const toZoneId = fromZoneId === "zone1" ? "zone2" : "zone1"
  doSendCard({ cardId, fromZoneId, toZoneId })
  doArrangeCards()
}
