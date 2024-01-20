// not refactor to this file yet.

import {busyWaitThenDo} from './util';
import {DescContainer} from './desc_container';
import {log, logw} from './util_log';

function isWatch() {
  return location.pathname === '/watch'
}

function run() {
  if (!isWatch()) {
    return
  }
  document.querySelectorAll("ytd-compact-video-renderer")
  const itemRootList = document.querySelectorAll("ytd-compact-video-renderer .details.style-scope.ytd-compact-video-renderer")
  const validateItems = Array.from(itemRootList)

  const mixItemRootList = document.querySelectorAll("ytd-compact-radio-renderer .details.style-scope.ytd-compact-radio-renderer")
  const validateMixItems = Array.from(mixItemRootList)

  validateItems.push(...validateMixItems)
  for (let validateItem of validateItems) {
    new DescContainer(validateItem).init(10)
  }
}

function _init_after_check_ready() {
  run()

  document.querySelector("ytd-watch-next-secondary-results-renderer ytd-item-section-renderer #contents")
  const container = document.querySelector("ytd-watch-next-secondary-results-renderer ytd-item-section-renderer #contents")
  if (container) {
    // not work anymore. why?
    log('set MutationObserver called')
    new MutationObserver(() => {
      log("MutationObserver callback called")
      // how to do this?
      run()
    }).observe(container, {
      childList: true,
    })
  } else {
    logw("why content is null??")
  }
}

export function initInWatch() {
  if (!isWatch()) {
    return
  }
  busyWaitThenDo(_init_after_check_ready, () => {
    return document.getElementsByTagName("ytd-compact-video-renderer").length > 0
  }, 4000)
}
