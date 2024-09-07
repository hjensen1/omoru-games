const peerIdLength = 6

export let peerId = window.localStorage.getItem("peerId")
if (!peerId || peerId.length > peerIdLength) {
  // random 6 character id with 0-9 A-Z
  peerId = new Array(peerIdLength)
    .fill(0)
    .map(() =>
      Math.floor(Math.random() * 36)
        .toString(36)
        .toUpperCase()
    )
    .join("")
  window.localStorage.setItem("peerId", peerId)
}
window.peerId = peerId
