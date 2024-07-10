export function logw(...args) {
  console.warn(...args)
}

export function log(...args: any[]) {
  if (true) {
    console.log.apply(null, args)
  }
}
