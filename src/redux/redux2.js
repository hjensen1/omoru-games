import { configureStore } from "@reduxjs/toolkit"
import produce from "immer"
import Peer from "peerjs"
import { v4 as uuid } from "uuid"
import { initialState } from "../decrypto/decryptoSlice"

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

let actionSource = null

function hostReceiveAction({ type, payload, peerjs }) {
  try {
    actionSource = peerjs.peerId
    actionDirectory[type](...payload)
    sendToClients({ type, payload, peerjs })
  } finally {
    actionSource = null
  }
}

function sendToClients({ type, payload, peerjs = { actionId: uuid(), peerId } }) {
  Object.values(peer.connections).forEach((conn) => {
    // console.log("send", conn)
    if (conn[0]) conn[0].send(JSON.stringify({ type, payload, peerjs }))
  })
}

function clientReceiveAction({ type, payload, peerjs }) {
  try {
    actionSource = peerjs.peerId
    console.log("clientReceiveAction", type, payload)
    actionDirectory[type](...payload)
  } finally {
    actionSource = null
  }
}

function hostSendFullState(conn) {
  console.log("hostSendFullState", store.getState())
  conn.send(
    JSON.stringify({
      type: "setFullState",
      peerjs: { actionId: uuid(), peerId },
      payload: [store.getState()],
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

export function enhance(name, actionFunction) {
  const result = (...params) => {
    const t = new Date()
    if (state) {
      depth++
      try {
        actionFunction(...params)
        console.log(name)
        // console.log(`${"".padStart(depth * 4, " ")}${name} - ${new Date() - t}ms`)
      } finally {
        depth--
      }
    } else if (!actionSource && peerId !== hostId) {
      sendToHost({ type: name, payload: params })
      // console.log(`Sent ${name} to host`)
    } else {
      // console.log(name)
      try {
        if (!actionSource) actionSource = peerId
        const result = produce(getState(), (draftState) => {
          state = draftState
          actionFunction(...params)
          console.log(name)
        })
        store.dispatch({ type: name, payload: result })

        if (peerId === hostId && actionSource === hostId) {
          sendToClients({ type: name, payload: params })
        }
      } catch (e) {
        throw e
      } finally {
        state = null
        actionSource = null
        // console.log(`${name} - ${new Date() - t}ms`)
      }
    }
  }

  actionDirectory[name] = result

  return result
}

export const doSetFullState = enhance("setFullState", function setFullState(fullState) {
  console.log(fullState)
  for (const key in fullState) {
    state[key] = fullState[key]
  }
})

actionDirectory.setFullState = doSetFullState

export function getState() {
  return store.getState()
}
