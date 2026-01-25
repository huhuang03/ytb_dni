// not refactor to this file yet.

import {checkThenDo, createElementCreator} from './util/util';
import {log, logw} from './util/util_log';
import {RecommendInWatch} from './recommend_in_watch';

function getRecommendList() {
  return Array.from(document.querySelectorAll("yt-lockup-view-model"))
}

function isWatchPage() {
  return location.pathname === '/watch'
}

const itemCreator = createElementCreator(RecommendInWatch)

function run() {
  log('init_in_watch run called!!!')
  if (!isWatchPage()) {
    return
  }
  getRecommendList().forEach(item => {
    itemCreator(item as HTMLElement).init(0)
  })
}

function _getRecommendListContainer() {
  return document.querySelector('ytd-watch-next-secondary-results-renderer ytd-item-section-renderer #contents')
}

function _init_after_check_ready() {
  log('_init_after_check_ready called!!!')
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
  log('initInWatch called')
  if (!isWatchPage()) {
    return
  }
  log('begin checkThenDo')
  checkThenDo(_init_after_check_ready, () => {
    return isWatchPage() && getRecommendList().length > 0
  }, 4000)
}
