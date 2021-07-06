import gameSlice from "./gameSlice"
import viewSlice from "./viewSlice"

export default function zhaoPengyouReducer(state = {}, action) {
  const oldState = state
  state = { ...state }
  state.game = gameSlice(...state.game, action)
  state.view = viewSlice(...state.view, { ...action, state })
  return state
}
