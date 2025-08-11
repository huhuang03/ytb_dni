// not refactor to this file yet.

import {checkThenDo} from './util/util';
import {log, logw} from './util/util_log';
import {RecommendInWatch} from './recommend_in_watch';

function getRecommendList() {
  return Array.from(document.querySelectorAll("ytd-watch-next-secondary-results-renderer yt-lockup-view-model"))
}

function isWatchPage() {
  return location.pathname === '/watch'
}

function run() {
  if (!isWatchPage()) {
    return
  }
  getRecommendList().forEach(item => {
    new RecommendInWatch(item as HTMLElement).init(0)
  })

  // const mixItemRootList = document.querySelectorAll("ytd-compact-radio-renderer .details.style-scope.ytd-compact-radio-renderer")
  // const validateMixItems = Array.from(mixItemRootList) as HTMLElement[]
  //
  // // short items
  // const shortElements = document.querySelectorAll("yt-horizontal-list-renderer.ytd-reel-shelf-renderer ytd-reel-item-renderer")
  // const shortItems = Array.from(shortElements) as HTMLElement[]
  //
  // validateItems.push(...validateMixItems)
  // validateItems.push(...shortItems)
  // for (let validateItem of validateItems) {
  //   new PlayCardInHomeWrapper(validateItem).init(10)
  // }
}

function _getRecommendListContainer() {
  return document.querySelector('ytd-watch-next-secondary-results-renderer ytd-item-section-renderer #contents')
}

function _init_after_check_ready() {
  run()

  const container = _getRecommendListContainer()
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
    return isWatchPage() && getRecommendList().length > 0
  }, 4000)
}
