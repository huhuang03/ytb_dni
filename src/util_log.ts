export function logw(...args) {
  console.log(...args)
}

export function log(...args: any[]) {
  if (true) {
    console.log.apply(null, args)
  }
}
