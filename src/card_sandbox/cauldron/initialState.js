import cardsState from "../../card_game/cardsState"
import { hostId } from "../../peerjsMiddleware/hostId"

export const initialState = {
  hostId,
  players: [],
  ...cardsState,
  cardSize: {
    width: 250,
    height: 350,
  },
}
