/**
 * Wait the element then do
 * @param check
 * @param run
 * @param timeout
 */
export function waitElement(
  {check, run, timeoutRun}: {
    check: () => HTMLElement | null | undefined,
    run: (el: HTMLElement) => void,
    timeoutRun?: () => void
  }) {
  return waitFor<HTMLElement>({
    check, run, timeoutRun
  })
}

export function waitBoolean(
  {check, run, timeoutRun, timeout}: {
    check: () => boolean,
    run: (el: boolean) => void,
    timeoutRun?: () => void,
    timeout?: number
  }) {
  return waitFor<boolean>({
    check, run, timeoutRun, timeout, boolChecker: (data) => !!data
  })
}

export function waitFor<T>(
  {check, run, timeoutRun, boolChecker, timeout}: {
    check: () => T | null | undefined,
    boolChecker?: (data?: T) => boolean,
    run: (ele: T) => void,
    timeoutRun?: () => void,
    timeout?: number
  }
) {
  boolChecker = boolChecker || ((data) => data !== null && data !== undefined)
  timeout = timeout || 1000
  const interval = 100
  const begin = new Date().getTime()
  const _iter = () => {
    const e = check()
    if (boolChecker(e)) {
      run(e)
    } else {
      const now = new Date().getTime()
      if ((now - begin) > timeout) {
        timeoutRun && timeoutRun()
        return
      }
      setTimeout(_iter, interval)
    }
  }

  _iter()
}
