// not refactor to this file yet.

import {checkThenDo} from './util/util';
import {PlayCardInHomeWrapper} from './player_card_in_home';
import {log, logw} from './util/util_log';

function isWatchPage() {
  return location.pathname === '/watch'
}

function run() {
  if (!isWatchPage()) {
    return
  }
  const itemRootList = document.querySelectorAll("ytd-compact-video-renderer .details.style-scope.ytd-compact-video-renderer")
  const validateItems = Array.from(itemRootList) as HTMLElement[]

  const mixItemRootList = document.querySelectorAll("ytd-compact-radio-renderer .details.style-scope.ytd-compact-radio-renderer")
  const validateMixItems = Array.from(mixItemRootList) as HTMLElement[]

  // short items
  const shortElements = document.querySelectorAll("yt-horizontal-list-renderer.ytd-reel-shelf-renderer ytd-reel-item-renderer")
  const shortItems = Array.from(shortElements) as HTMLElement[]

  validateItems.push(...validateMixItems)
  validateItems.push(...shortItems)
  for (let validateItem of validateItems) {
    new PlayCardInHomeWrapper(validateItem).init(10)
  }
}

function _init_after_check_ready() {
  run()

  const container = document.querySelector("ytd-watch-next-secondary-results-renderer ytd-item-section-renderer #contents")
  if (container) {
    new MutationObserver(() => {
      run()
    }).observe(container, {
      childList: true,
    })
  } else {
    logw("why content is null??")
  }
}

export function initInWatch() {
  if (!isWatchPage()) {
    return
  }
  checkThenDo(_init_after_check_ready, () => {
    return isWatchPage() && document.getElementsByTagName('yt-lockup-view-model').length > 0
  }, 4000)
}
