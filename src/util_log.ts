export function logw(...args) {
  console.log(...args)
}

export function log(...args: any[]) {
  if (false) {
    console.log.apply(null, args)
  }
}
