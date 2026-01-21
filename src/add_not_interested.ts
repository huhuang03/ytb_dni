import {HtmlElementWrapper} from './common/html_element_wrapper';
import {MenuContainer} from './menu_container';
import {checkThenDo} from './util/util';
import {log, logw} from './util/util_log';
import {PlayCardInHomeWrapper} from './player_card_in_home';
import {initInWatch} from './init_in_watch';
import {ShortInHome} from './short_in_home';

class PreviewMenu extends HtmlElementWrapper {
  constructor(root: HTMLElement) {
    super(root)
    this._init()
  }

  _init() {
    const containerEle = this._getContainer();
    if (containerEle == null) {
      return
    }

    // @ts-ignore
    const dniContainer = new MenuContainer(containerEle)
    // @ts-ignore
    dniContainer.setMenu(() => containerEle.querySelector('yt-icon-button.dropdown-trigger').querySelector('#button'))
  }

  _getContainer() {
    // how do you think of this?
    const containers = this.ele.getElementsByTagName('ytd-menu-renderer')
    if (containers != null && containers.length > 0) {
      return containers[0]
    }
    return null
  }
}

function queryPlayerList(): HTMLElement[] {
  return Array.from(document.querySelectorAll('yt-lockup-view-model'))
}

function run() {
  // the normal videos
  let playerList = queryPlayerList()
  playerList.forEach(ele => {
    new PlayCardInHomeWrapper(ele as HTMLElement).init()
  })

  let shorts = Array.from(document.querySelectorAll('ytm-shorts-lockup-view-model-v2'))
  shorts.forEach(ele => {
    new ShortInHome(ele as HTMLElement).init()
  })
}

// what's this?
function _initPreview() {
  if ((window as any)._has_init_preview) {
    return;
  }

  (window as any)._has_init_preview = true;
  setTimeout(() => {
    const preview = document.getElementById('preview')
    if (preview == null) {
      return
    }
    const menu = preview.querySelector('#menu') as HTMLElement
    if (menu == null) {
      return
    }

    const handlePreviewChange = function (mutationsList: any, observer: any) {
      for (let mutation of mutationsList) {
        // how do you think??
        setTimeout(() => {
          new PreviewMenu(menu)
        }, 0)
      }
    }

    const observer = new MutationObserver(handlePreviewChange)
    observer.observe(menu, {childList: true})
  }, 1000)
}

function _getContentElement() {
  let contents = document.querySelectorAll('[id=contents]')
  if (!contents || contents.length === 0) {
    return undefined;
  }

  if (contents && contents.length > 0) {
    for (let ele of Array.from(contents)) {
      if (ele.clientWidth) {
        return ele
      }
    }
  }
  return undefined;
}

function _initItems() {
  run()
  const e_content = _getContentElement()
  if (e_content) {
    new MutationObserver(() => {
      if (isYtbHome()) {
        run()
      }
    }).observe(e_content, {
      childList: true,
    })
  } else {
    logw('why content is null??')
  }
}

// some things it's too early this get called.
// should wait for the content is ready!!
function _initial() {
  if (!isYtbHome()) {
    return
  }

  if ((window as any)._has_add_ytb_dni) {
    return
  }

  // 如果是从详情点击图片返回的，有两个contents
  (window as any)._has_add_ytb_dni = true

  // seems like this is used in play
  _initPreview()

  checkThenDo(() => {
    _initItems()
  }, () => {
    return _getContentElement() != null && queryPlayerList().length > 0
  }, 4000, 500)
}

function isYtbHome() {
  const location = window.location
  return location && (location.pathname == '/' || location.pathname == '')
}


function _main() {
  const pathname = window.location.pathname
  initInWatch()
  if (pathname && pathname !== '/') {
    return
  }

  setTimeout(_initial, 0)
}

_main()
