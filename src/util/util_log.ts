export function logw(...args: any[]) {
  console.warn(...args)
}

export function log(...args: any[]) {
  if (false) {
    console.log.apply(null, args)
  }
}
