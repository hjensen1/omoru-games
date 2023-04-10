import actions from "../cauldron/actions"
import { state } from "../cauldron/state"
import { hostId } from "./hostId"
import { actionSource, sendToClients, sendToHost, setActionSource } from "./peerActions"
import { peerId } from "./peerId"

const peerjsMiddleware = {
  beforeAction: ({ actionName, params }) => {
    if (!actionSource && peerId !== hostId) {
      sendToHost({ actionName, params })
      return false
    } else {
      if (!actionSource) setActionSource(peerId)
      return true
    }
  },
  afterAction: ({ actionName, params }) => {
    if (peerId === hostId && actionSource === hostId) {
      console.log(params)
      sendToClients({ actionName, params })
    }
  },
  finally: () => {
    setActionSource(null)
  },
}

export function applyPeerjsMiddleware(cauldron) {
  cauldron.cauldronMiddleware = [peerjsMiddleware]
  actions.doSetFullState = (fullState) => {
    for (const key in fullState) {
      state[key] = fullState[key]
    }
  }
}
