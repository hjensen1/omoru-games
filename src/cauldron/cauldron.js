export let cauldron

export function setCauldron(c) {
  cauldron = c
  Object.defineProperty(window, "cauldron", {
    get() {
      return cauldron.getState()
    },
  })
}
