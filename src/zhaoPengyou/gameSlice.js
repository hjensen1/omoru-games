import { createSlice } from "@reduxjs/toolkit"
import { buildDeck, sortHand, isTrump, getSuit, buildCardOrder, getHandShape } from "./cardHelpers"

const gameSlice = createSlice({
  name: "game",
  initialState: {
    deck: [],
    kitty: [],
    hands: {},
    dealerTricks: [],
    opponentTricks: [],
    teams: {
      dealer: [],
      opponent: [],
    },
    ranks: {},
    currentPlayer: {},
  },
  reducers: {},
  extraReducers: {},
})

export default gameSlice.reducer
