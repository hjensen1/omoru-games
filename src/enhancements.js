Object.defineProperty(Array.prototype, "last", {
  enumerable: false,
  configurable: false,
  get() {
    return this[this.length - 1]
  },
  set(value) {
    const index = this.length ? this.length - 1 : 0
    return (this[index] = value)
  },
})

export default true
