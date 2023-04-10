import produce from "immer"
import { cauldron } from "./cauldron"
import { setState, state } from "./state"

let depth = 0

export function buildAction(actionName, actionFunction) {
  return (...params) => {
    if (state) {
      handleSubAction(actionName, actionFunction, params)
    } else {
      handleRootAction(actionName, actionFunction, params)
    }
  }
}

function handleSubAction(actionName, actionFunction, params) {
  const startTime = new Date()
  depth++

  actionFunction(...params)

  console.log(`${"".padStart(depth * 4, " ")}${actionName} - ${new Date() - startTime}ms`)
  depth--
}

function handleRootAction(actionName, actionFunction, params) {
  depth = 0
  console.log(actionName)

  for (const middleware of cauldron.cauldronMiddleware || []) {
    const middlewareResult = middleware.beforeAction({actionName, actionFunction, params})
    if (!middlewareResult) return
  }

  try {
    const startTime = new Date()

    const result = produce(cauldron.getState(), (draftState) => {
      setState({ state: draftState, prevState: cauldron.getState(), unsafeState: {} })
      actionFunction(...params)
    })
    cauldron.dispatch({ type: actionName, payload: result })

    for (const middleware of cauldron.cauldronMiddleware || []) {
      middleware.afterAction({actionName, actionFunction, params})
    }

    console.log(`${actionName} - ${new Date() - startTime}ms`)
  } catch (e) {
    if (cauldron.onError) {
      cauldron.onError(cauldron, e)
    } else {
      throw e
    }
  } finally {
    setState({ state: null, prevState: null, unsafeState: null })

    for (const middleware of cauldron.cauldronMiddleware || []) {
      middleware.finally({actionName, actionFunction, params})
    }
  }
}
