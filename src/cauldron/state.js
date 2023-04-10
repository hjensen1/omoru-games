export let state = null
export let prevState = null
export let unsafeState = null

export function setState(options) {
  state = options.state
  prevState = options.prevState
  unsafeState = options.unsafeState
}

export function getState() {
  return { state, prevState, unsafeState }
}
