import { configureStore } from "@reduxjs/toolkit"
import produce from "immer"
import Peer from "peerjs"
import { v4 as uuid } from "uuid"

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

function sendToHost({ type, payload }) {
  const conn = peer.connections[hostId][0]
  if (conn) {
    conn.send(JSON.stringify({ type, payload, peerjs: { actionId: uuid(), peerId } }))
  } else {
    console.log("Missing connection to host")
  }
}

let isReceived = false

function hostReceiveAction({ type, payload, peerjs }) {
  try {
    isReceived = true
    actionDirectory[type](payload)
    sendToClients({ type, payload, peerjs })
  } finally {
    isReceived = false
  }
}

function sendToClients({ type, payload, peerjs = { actionId: uuid(), peerId } }) {
  Object.values(peer.connections).forEach((conn) => {
    console.log("send", conn)
    conn[0].send(JSON.stringify({ type, payload, peerjs }))
  })
}

function clientReceiveAction({ type, payload, peerjs }) {
  try {
    isReceived = true
    console.log("clientReceiveAction", type)
    actionDirectory[type](payload)
  } finally {
    isReceived = false
  }
}

function hostSendFullState(conn) {
  console.log("hostSendFullState", store.getState())
  conn.send(
    JSON.stringify({
      type: "setFullState",
      peerjs: { actionId: uuid(), peerId },
      payload: store.getState(),
    })
  )
}

let peer

async function initializePeer() {
  const servers = await fetch("https://omoru-stun-turn.herokuapp.com/", {
    method: "GET",
  }).then((response) => response.json())

  peer = new Peer(peerId, {
    host: "omoru-peerjs-server.herokuapp.com",
    port: 443,
    secure: true,
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

// Redux Stuff

const initialState = { connectionTest: { counter: 0 } }

function rootReducer(state, action) {
  return state ? action.payload : initialState
}

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
})

Object.defineProperty(window, "reduxStore", {
  get() {
    return store.getState()
  },
})

export let state = null
let depth = 0

const actionDirectory = {}

export function enhance(actionFunction) {
  const result = (...params) => {
    const t = new Date()
    if (state) {
      depth++
      try {
        actionFunction(...params)
        console.log(`${"".padStart(depth * 4, " ")}${actionFunction.name} - ${new Date() - t}ms`)
      } finally {
        depth--
      }
    } else if (!isReceived && peerId !== hostId) {
      sendToHost({ type: actionFunction.name, payload: params })
      console.log(`Sent ${actionFunction.name} to host`)
    } else {
      console.log(actionFunction.name)
      try {
        const result = produce(getStore(), (draftState) => {
          state = draftState
          actionFunction(...params)
        })
        store.dispatch({ type: actionFunction.name, payload: result })

        if (peerId === hostId && !isReceived) {
          sendToClients({ type: actionFunction.name, payload: params })
        }
      } catch (e) {
        throw e
      } finally {
        state = null
        console.log(`${actionFunction.name} - ${new Date() - t}ms`)
      }
    }
  }

  actionDirectory[actionFunction.name] = result

  return result
}

const doSetFullState = enhance(function setFullState(fullState) {
  console.log(fullState)
  for (const key in fullState) {
    state[key] = fullState[key]
  }
})

actionDirectory.setFullState = doSetFullState

export function getStore() {
  return store.getState()
}
