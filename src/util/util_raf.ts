export function createRafScheduler(fn: () => void) {
  let scheduled = false

  return function schedule() {
    if (scheduled) return
    scheduled = true

    requestAnimationFrame(() => {
      scheduled = false
      fn()
    })
  }
}
