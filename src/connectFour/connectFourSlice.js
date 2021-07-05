import { createSlice } from "@reduxjs/toolkit"

const connectFourSlice = createSlice({
  name: "connectFour",
  initialState: {
    columns: [[], [], [], [], [], [], []],
    turnNumber: 0,
    players: [],
    currentPlayer: null,
    lastPlay: [],
    message: "Waiting for players...",
    // previousStates: [],
  },
  reducers: {
    addPlayer(state, { payload }) {
      const { id, name } = payload
      if (state.players.length < 2) {
        state.players.push({ id, name, key: state.players.length === 0 ? "-" : "X" })
        if (state.players.length === 2) {
          state.currentPlayer = state.players[Math.round(Math.random())]
          state.turnNumber = 1
          state.message = `Turn 1: ${state.currentPlayer.name}`
        }
      }
    },
    playPiece(state, action) {
      const column = action.payload
      if (column.size >= 6) {
        // illegal move
      } else {
        // state.previousStates.push({ ...state, previousStates: [] })
        state.columns[column].push(state.currentPlayer.key)
        state.lastPlay = [column, state.columns[column].length - 1]

        const winner = checkVictory(state)
        if (winner) {
          console.log(winner)
          const winningPlayer = state.players.find((p) => p.key === winner)
          state.currentPlayer = null
          state.message = `${winningPlayer.name} wins!`
        } else {
          state.currentPlayer = state.players.find((p) => p.id !== state.currentPlayer.id)
          state.turnNumber++
          state.message = `Turn ${state.turnNumber}: ${state.currentPlayer.name}`
        }
      }
    },
  },
  extraReducers: {
    setFullState(_, { payload }) {
      return payload.connectFour
    },
  },
})

export default connectFourSlice.reducer
export const { addPlayer, playPiece } = connectFourSlice.actions

function checkVictory(state) {
  const { columns } = state
  let filled = 0
  const directions = [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1],
  ]
  for (let x = 0; x < 7; x++) {
    for (let y = 0; y < 6; y++) {
      if (columns[x][y]) filled++
      for (const [dx, dy] of directions) {
        const result = checkLine(columns, x, y, dx, dy)
        if (result) return result
      }
    }
  }
}

function checkLine(columns, x, y, dx, dy) {
  let prev = columns[x][y]
  if (!prev) return false
  for (let i = 1; i < 4; i++) {
    const x2 = x + dx * i
    if (x2 > 6) return false
    const value = columns[x2][y + dy * i]
    console.log(value === prev)
    if (value !== prev) return false
    prev = value
  }
  return prev
}
