import { hostId } from "../../peerjsMiddleware/hostId"

const cards = [
  { id: "Guard1", value: 1, name: "Guard" },
  { id: "Guard2", value: 1, name: "Guard" },
  { id: "Guard3", value: 1, name: "Guard" },
  { id: "Guard4", value: 1, name: "Guard" },
  { id: "Guard5", value: 1, name: "Guard" },
  { id: "Priest1", value: 2, name: "Priest" },
  { id: "Priest2", value: 2, name: "Priest" },
  { id: "Baron1", value: 3, name: "Baron" },
  { id: "Baron2", value: 3, name: "Baron" },
  { id: "Handmaid1", value: 4, name: "Handmaid" },
  { id: "Handmaid2", value: 4, name: "Handmaid" },
  { id: "Prince1", value: 5, name: "Prince" },
  { id: "Prince2", value: 5, name: "Prince" },
  { id: "King", value: 6, name: "King" },
  { id: "Countess", value: 7, name: "Countess" },
  { id: "Princess", value: 8, name: "Princess" },
]

const cardState = {}
cards.forEach((card) => {
  cardState[card.id] = { zoneId: "deck" }
})

export const initialState = {
  hostId,
  players: [],
  seats: [null, null, null, null],
  scores: {},
  zones: {
    // zone1: {
    //   id: "zone1",
    //   type: "hand",
    //   owner: null,
    // },
    deck1: {
      id: "deck",
      type: "deck",
      revealed: false,
      owner: null,
    },
  },
  cards: cards,
  cardsByZoneId: {
    deck: cards,
  },
  cardState,
}
