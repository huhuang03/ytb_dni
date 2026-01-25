export function eleIsShowing(ele: HTMLElement | null | undefined): boolean {
  if (!ele) {
    return false
  }
  return ele.getBoundingClientRect().width > 0 &&
    ele.getBoundingClientRect().height > 0;
}

export function findParent(ele: HTMLElement | null, check: (ele: HTMLElement) => boolean): HTMLElement | null {
  if (!ele) {
    return ele
  }
  if (check(ele)) {
    return ele
  }
  return findParent(ele.parentElement, check)
}


/**
 * repeat check, do if check success
 * @param func
 * @param checkFunc
 * @param timeout
 * @param checkInterval
 */
export function checkThenDo(func: () => void, checkFunc: () => boolean,
                            timeout: number,
                            checkInterval = 50) {
  let startTime = new Date().getTime()
  _waitAndDoOnce(startTime, func, checkFunc, timeout, checkInterval)
}

function _waitAndDoOnce(startTime: any, func: any, checkFunc: any,
                        timeout: any, checkInterval: any) {
  setTimeout(() => {
    if (checkFunc()) {
      func()
    } else if ((new Date().getTime() - startTime) < timeout) {
      _waitAndDoOnce(startTime, func, checkFunc, timeout, checkInterval)
    }
  }, checkInterval)
}

export function createElementCreator<T>(
  Ctor: new (el: HTMLElement) => T
) {
  const cache = new WeakMap<HTMLElement, T>()

  return function getInstance(el: HTMLElement): T {
    const cached = cache.get(el)
    if (cached) return cached

    const instance = new Ctor(el)
    cache.set(el, instance)
    return instance
  }
}
