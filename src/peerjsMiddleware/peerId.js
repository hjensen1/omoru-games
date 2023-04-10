import { v4 as uuid } from "uuid"

export let peerId = window.localStorage.getItem("peerId")
if (!peerId) {
  peerId = uuid()
  window.localStorage.setItem("peerId", peerId)
}
window.peerId = peerId
