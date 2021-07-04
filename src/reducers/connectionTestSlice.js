import { createSlice } from "@reduxjs/toolkit"

const connectionTestSlice = createSlice({
  name: "connectionTest",
  initialState: { counter: 0 },
  reducers: {
    incrementCounter(state, { payload }) {
      state.counter++
    },
  },
  extraReducers: {
    setFullState(state, { payload }) {
      state.counter = payload.connectionTest.counter
    },
  },
})

export default connectionTestSlice.reducer
export const { incrementCounter } = connectionTestSlice.actions
