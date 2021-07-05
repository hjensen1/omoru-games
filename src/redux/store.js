import { configureStore } from "@reduxjs/toolkit"
import peerjsMiddleware from "./peerjsMiddleware"
import rootReducer from "../rootReducer"

export default configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: true,
      immutableCheck: true,
    }).concat(peerjsMiddleware),
})
