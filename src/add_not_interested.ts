import {HtmlElementWrapper} from './common/html_element_wrapper';
import {MenuContainer} from './menu_container';
import {SVG_ID} from './constants';
import {checkThenDo} from './util/util';
import {log, logw} from './util/util_log';
import {VideoCardMenuWrapper} from './item_container';
import {initInWatch} from './init_in_watch';
import {SHORTS_MENU_CONTAINER_QUERY_SELECTOR, SHORTS_MENU_QUERY_SELECTOR} from './shorts';
import {ElementByQueryFinder} from './common/element_finder';

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

function queryVideoCardMenuRoot(): HTMLElement[] {
  return Array.from(document.querySelectorAll('ytd-rich-item-renderer button-view-model'))
}

function getShortMenuContainerList(): HTMLElement[] {
  return Array.from(document.querySelectorAll('[is-shorts].ytd-rich-section-renderer ytd-rich-item-renderer'))
}

function run() {
  let items = queryVideoCardMenuRoot()
  items.map(d => {
      if (isYtbHome()) {
          new VideoCardMenuWrapper(d).init()
      }
  })

  let shortMenuContainerList = getShortMenuContainerList()
  shortMenuContainerList.map(d => {
    if (isYtbHome()) {
      new VideoCardMenuWrapper(
        d, new ElementByQueryFinder(SHORTS_MENU_CONTAINER_QUERY_SELECTOR),
        new ElementByQueryFinder(SHORTS_MENU_QUERY_SELECTOR)).init()
        false
    }
  })
}

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
      log('handlePreviewChange called ----------')
      for (let mutation of mutationsList) {
        log('mutation: ' + mutation.type)
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
    logw('ytb has already initialed!!')
    return
  }

  // 如果是从详情点击图片返回的，有两个contents
  // <div id="contents" class="style-scope ytd-item-section-renderer"></div>
  (window as any)._has_add_ytb_dni = true

  // seems like this is used in play
  _initPreview()

  // ok how to do this?
  checkThenDo(() => {
    _initItems()
  }, () => {
    return _getContentElement() != null && queryVideoCardMenuRoot().length > 0
  }, 4000, 500)
}

function isYtbHome() {
  const location = window.location
  return location && (location.pathname == '/' || location.pathname == '')
}


// can you inject css not like this!!
// this will not change!!
function _addCss() {
  // add css
  const fillColor = 'var(--ytd-menu-renderer-button-color, var(--yt-spec-icon-inactive))';
  // const fillHoverColor = 'var(--ytd-menu-renderer-button-color, var(--yt-spec-icon))';
  const fillHoverColor = 'var(--ytd-menu-renderer-button-color, var(--yt-spec-icon-active-other))';

  let css = `#${SVG_ID}:hover {fill: ${fillHoverColor}}\n #${SVG_ID} {fill: ${fillColor};}`;
  // let css = `#${SVG_ID}:hover {fill: #606060}\n #${SVG_ID} {fill: #8b8b8b}`
  let style = document.createElement('style') as any;

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  document.getElementsByTagName('head')[0].appendChild(style);
}

function _main() {
  const pathname = window.location.pathname
  _addCss()
  initInWatch()
  if (pathname && pathname !== '/') {
    return
  }

  setTimeout(_initial, 0)
}

_main()
