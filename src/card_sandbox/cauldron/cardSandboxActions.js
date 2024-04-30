import { doArrangeCards } from "../../card_game/arrangeCards"
import { doAddCardToGame, doAddZoneToGame, doSendCard } from "../../card_game/genericCardActions"
import { buildPlayingCardDeck } from "../../card_game/playingCardImages"
import actions from "../../cauldron/actions"
import { cauldron } from "../../cauldron/cauldron"

actions.doInitCardSandbox = function () {
  doAddZoneToGame({
    id: "zone1",
    type: "hand",
    top: 10,
    left: 10,
    width: 1200,
    height: 350,
  })
  doAddZoneToGame({
    id: "zone2",
    type: "hand",
    top: 400,
    left: 10,
    width: 1200,
    height: 350,
  })
  doAddZoneToGame({
    id: "deck1",
    type: "deck",
    top: 800,
    left: 500,
    width: 250,
    height: 350,
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
