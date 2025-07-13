/**
 * Wait the element then do
 * @param check
 * @param run
 * @param timeout
 */
export function waitElement(
  {check, run, timeoutRun}: {
    check: () => HTMLElement | null | undefined,
    run: (el: HTMLElement | null | undefined) => void,
    timeoutRun?: () => void
  }) {
  return waitFor<HTMLElement>({
    check, run, timeoutRun
  })
}

export function waitBoolean(
  {check, run, timeoutRun, timeout}: {
    check: () => boolean,
    run: (el: Boolean | null | undefined) => void,
    timeoutRun?: () => void,
    timeout?: number
  }) {
  return waitFor<Boolean>({
    check, run, timeoutRun, timeout, boolChecker: (data) => !!data
  })
}

export function waitFor<T>(
  {check, run, timeoutRun, boolChecker, timeout}: {
    check: () => T | null | undefined,
    run: (ele: T | null | undefined) => void,
    timeoutRun?: () => void,
    boolChecker?: (data: T | null | undefined) => boolean,
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
