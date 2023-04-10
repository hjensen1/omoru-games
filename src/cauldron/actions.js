import { buildAction } from "./buildAction"

const baseActions = {}

const actions = new Proxy(baseActions, {
  set: (actions, key, value) => {
    if (key.startsWith("do")) {
      const actionFunction = buildAction(key, value)
      return Reflect.set(actions, key, actionFunction)
    } else {
      return Reflect.set(...arguments)
    }
  },
})

export default actions

window.actions = baseActions
