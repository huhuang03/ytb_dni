export function eleIsShowing(ele?: HTMLElement) {
  if (!ele) {
    return false
  }
  return ele.getBoundingClientRect().width > 0 &&
    ele.getBoundingClientRect().height > 0;
}

export function findParent(ele: HTMLElement, check: (ele: HTMLElement) => boolean): HTMLElement | null {
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
