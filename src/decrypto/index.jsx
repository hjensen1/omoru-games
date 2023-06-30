import React from "react"
import ReactDOM from "react-dom"
import "../index.css"
import App from "./App"
import { Provider } from "react-redux"
import { produce } from "immer"
import md5 from "crypto-js/md5"
import { keyBy, sortBy } from "lodash"
import buildStore from "../cauldron/buildStore"
import { initialState } from "./cauldron/initialState"
import { setCauldron } from "../cauldron/cauldron"
import { initializePeer } from "../peerjsMiddleware/initializePeer"
import { applyPeerjsMiddleware } from "../peerjsMiddleware/peerjsMiddleware"

window.md5 = md5
window.produce = produce
window.timer = function (message, f) {
  const t = new Date()
  const result = f()
  console.log(`${message} took ${new Date() - t}ms`)
  return result
}
window.sortBy = sortBy
window.keyBy = keyBy

// eslint-disable-next-line no-extend-native
Object.defineProperty(Array.prototype, "last", {
  enumerable: false,
  configurable: false,
  get() {
    return this[this.length - 1]
  },
  set(value) {
    const index = this.length ? this.length - 1 : 0
    return (this[index] = value)
  },
})

const cauldron = buildStore({ initialState })
applyPeerjsMiddleware(cauldron)
setCauldron(cauldron)

initializePeer()

ReactDOM.render(
  <Provider store={cauldron}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
)
