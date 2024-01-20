// 不断调用checkFunc。一旦返回ture，则调用func
export function busyWaitThenDo(func, checkFunc, timeout, checkInterval = 50) {
  let startTime = new Date().getTime()
  _waitAndDoOnce(startTime, func, checkFunc, timeout, checkInterval)
}

function _waitAndDoOnce(startTime, func, checkFunc, timeout, checkInterval) {
  setTimeout(() => {
    if (checkFunc()) {
      func()
    } else if ((new Date().getTime() - startTime) < timeout) {
      _waitAndDoOnce(startTime, func, checkFunc, timeout, checkInterval)
    }
  }, checkInterval)
}
