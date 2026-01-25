export function logw(...args: any[]) {
  console.warn(...args)
}

export function log(...args: any[]) {
  if (true) {
    console.log.apply(null, args)
  }
}
