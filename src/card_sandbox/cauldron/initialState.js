import { hostId } from "../../peerjsMiddleware/hostId"

const deckCards = [
  { face: "C2", id: "C2" },
  { face: "C3", id: "C3" },
  { face: "D2", id: "D2" },
  { face: "D3", id: "D3" },
  { face: "H2", id: "H2" },
  { face: "H3", id: "H3" },
  { face: "S2", id: "S2" },
  { face: "S3", id: "S3" },
  { face: "C4", id: "C4" },
  { face: "C5", id: "C5" },
  { face: "D4", id: "D4" },
  { face: "D5", id: "D5" },
  { face: "H4", id: "H4" },
  { face: "H5", id: "H5" },
  { face: "S4", id: "S4" },
  { face: "S5", id: "S5" },
]

const zone1Cards = [{ face: "SA", id: "SA" }]

const cards = [...deckCards, ...zone1Cards]

export const initialState = {
  hostId,
  players: [],
  zones: {
    zone1: {
      id: "zone1",
      owner: null,
      cards: zone1Cards,
    },
    zone2: {
      id: "zone2",
      owner: null,
      cards: [],
    },
    deck1: {
      id: "deck1",
      type: "deck",
      revealed: false,
      owner: null,
      cards: deckCards,
    },
  },
  cards: cards,
}
