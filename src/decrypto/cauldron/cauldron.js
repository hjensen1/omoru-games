import buildStore from "../../cauldron/buildStore"
import { cauldron } from "../../cauldron/cauldron"
import { initialState } from "./initialState"

cauldron = buildStore({ initialState })

Object.defineProperty(window, "cauldron", {
  get() {
    return cauldron.getState()
  },
})
