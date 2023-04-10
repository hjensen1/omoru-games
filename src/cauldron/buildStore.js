import { configureStore } from "@reduxjs/toolkit"

export default function buildStore({ initialState }) {
  function rootReducer(state, action) {
    return state ? action.payload : initialState
  }

  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      }),
  })

  return store
}
