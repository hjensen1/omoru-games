import { peerId } from "./peerId"

export let hostId = window.location.hash.slice(1)
if (!hostId) {
  window.location.hash = `#${peerId}`
  hostId = peerId
}
window.hostId = hostId
