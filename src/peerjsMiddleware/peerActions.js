import { v4 as uuid } from "uuid"
import actions from "../cauldron/actions"
import { cauldron } from "../cauldron/cauldron"
import { hostId } from "./hostId"
import { peer } from "./peer"
import { peerId } from "./peerId"

export function sendToHost({ actionName, params }) {
  const conn = peer.connections[hostId][0]
  if (conn) {
    conn.send(JSON.stringify({ actionName, params, peerjs: { actionId: uuid(), peerId } }))
  } else {
    console.log("Missing connection to host")
  }
}

export let actionSource = null
export function setActionSource(a) {
  actionSource = a
}

export function hostReceiveAction({ actionName, params, peerjs }) {
  try {
    actionSource = peerjs.peerId
    actions[actionName](...params)
    sendToClients({ actionName, params, peerjs })
  } finally {
    actionSource = null
  }
}

export function sendToClients({ actionName, params, peerjs = { actionId: uuid(), peerId } }) {
  Object.values(peer.connections).forEach((conn) => {
    // console.log("send", conn)
    if (conn[0]) conn[0].send(JSON.stringify({ actionName, params, peerjs }))
  })
}

export function clientReceiveAction({ actionName, params, peerjs }) {
  try {
    actionSource = peerjs.peerId
    // console.log("clientReceiveAction", type, payload)
    actions[actionName](...params)
  } finally {
    actionSource = null
  }
}

export function hostSendFullState(conn) {
  // console.log("hostSendFullState", cauldron.getState())
  conn.send(
    JSON.stringify({
      actionName: "doSetFullState",
      peerjs: { actionId: uuid(), peerId },
      params: [cauldron.getState()],
    })
  )
}
