import Peer from "peerjs"
import { hostId } from "./hostId"
import { peer, setPeer } from "./peer"
import { clientReceiveAction, hostReceiveAction, hostSendFullState } from "./peerActions"
import { peerId } from "./peerId"

export async function initializePeer() {
  const servers = await fetch("https://omoru-stun-turn.herokuapp.com/", {
    method: "GET",
  }).then((response) => response.json())

  setPeer(
    new Peer(peerId, {
      host: "omoru-peerjs-server.herokuapp.com",
      port: 443,
      secure: true,
      debug: 2,
      config: {
        iceServers: servers,
      },
    })
  )
  window.peer = peer

  peer.on("open", (id) => {
    if (peer.id === null) {
      console.log("Received null id from peer open")
      peer.id = peerId
    }
    console.log("open")
    if (peerId === hostId) {
    } else if (hostId) {
      const conn = peer.connect(hostId, { reliable: true, serialization: "none" })
      conn.on("data", (data) => {
        console.log("data")
        const action = JSON.parse(data)
        clientReceiveAction(action)
      })
    }
  })

  peer.on("connection", (conn) => {
    if (peerId === hostId) {
      conn.on("data", (data) => {
        const action = JSON.parse(data)
        hostReceiveAction(action)
      })
      conn.on("error", (e) => console.log(e))
      conn.on("close", () => console.log("close"))
      conn.on("open", () => {
        hostSendFullState(conn)
      })
      // setInterval(() => conn.send("test"), 1000)
    }
  })

  peer.on("disconnected", () => {})

  peer.on("close", () => {})

  peer.on("error", (e) => console.log(e))

  return peer
}
