import Peer from "peerjs"
import { v4 as uuid } from "uuid"
import store from "./store"

let peerId = window.localStorage.getItem("peerId")
if (!peerId) {
  peerId = uuid()
  window.localStorage.setItem("peerId", peerId)
}
window.peerId = peerId

let hostId = window.location.hash.slice(1)
if (!hostId) {
  window.location.hash = `#${peerId}`
  hostId = peerId
}
window.hostId = hostId

const peerjsMiddleware = (store) => (next) => (action) => {
  if (action.peerjs) {
    if (action.peerjs.hostId) {
      // received state update from host, just apply update
      return next(action)
    } else {
      // received request from client
      // apply changes and then we will send updates in a thunk action
      return next(action)
    }
  } else {
    sendToHost(action)
    return next({ type: "queueAction", payload: action })
  }
}

export default peerjsMiddleware

function sendToHost(action) {
  console.log(action)
  action = { ...action, peerjs: { actionId: uuid(), peerId } }
  if (peerId === hostId) {
    hostReceiveAction(action)
  } else {
    const conn = peer.connections[hostId][0]
    if (conn) {
      conn.send(JSON.stringify(action))
    } else {
      console.log("Missing connection to host")
    }
  }
}

function hostReceiveAction(action) {
  store.dispatch(action)
  Object.values(peer.connections).forEach((conn) => {
    hostSendFullState(conn[0])
  })
}

function clientReceiveAction(action) {
  console.log("clientReceiveAction", action)
  store.dispatch(action)
}

function hostSendFullState(conn) {
  console.log("hostSendFullState", store.getState())
  conn.send(
    JSON.stringify({
      type: "setFullState",
      peerjs: { actionId: uuid(), peerId },
      payload: store.getState(),
    }),
  )
}

let peer

async function initializePeer() {
  const servers = await fetch("https://omoru-stun-turn.herokuapp.com/", { method: "GET" }).then(
    (response) => response.json(),
  )
  peer = new Peer(peerId, {
    debug: 2,
    config: {
      iceServers: servers,
    },
  })
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
}

initializePeer()
