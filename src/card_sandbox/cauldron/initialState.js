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

const exampleCardDisplay = {
  C2: {
    id: "C2",
    face: "C2",
    back: "Back1",
    top: 10,
    left: 10,
    width: 250,
    height: 350,
    rotation: 0,
    zIndex: 0,
    view: "face-up",
    visible: true,
  },
}

const exampleCardState = {
  id: "C2",
  orientation: "face-up",
  rotation: 0,
  zoneId: "p1hand",
}
