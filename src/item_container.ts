import {HtmlElementWrapper} from './common/html_element_wrapper';
import {checkThenDo} from './util/util';
import {MenuContainer} from './menu_container';
import {ElementByQueryFinder, ElementFinder, EmptyElementFinder} from './common/element_finder';

const _menuContainerFinder: ElementFinder = {
  find(item: HTMLElement) {
    return item.parentElement
  }
}

const _menuFinder: ElementFinder = {
  find(item: HTMLElement) {
    return item
  }
}

export class VideoCardMenuWrapper extends HtmlElementWrapper {
  canAddBt = false
  menuContainerFinder: ElementFinder
  menuFinder: ElementFinder
  checkClickReason = true

  /**
   * @param ele ele 应该是desc的container
   * @param menuContainerFinder
   * @param menuFinder
   */
  constructor(
    ele: HTMLElement,
    menuContainerFinder: ElementFinder = _menuContainerFinder,
    menuFinder: ElementFinder = _menuFinder,
    checkClickReason = true) {
    super(ele)
    this.menuContainerFinder = menuContainerFinder
    this.menuFinder = menuFinder
    this.checkClickReason = checkClickReason
  }

  init(marginTop = 0) {
    this.canAddBt = this.ele.offsetWidth > 0

    if (this.canAddBt) {
      checkThenDo(() => {
        const menuContainer = this.menuContainerFinder.find(this.ele)
        // @ts-ignore
        const dniContainer = new MenuContainer(menuContainer, marginTop, this.checkClickReason);
        dniContainer.setMenu(() => this.getMenuButton())
      }, () => {
        return this.ele && !!this.menuContainerFinder.find(this.ele)
      }, 10000, 500)
    }
  }

  getMenuButton() {
    const menu = this.menuFinder.find(this.ele)
    if (menu?.children && menu.children.length > 0 && menu.children[0].tagName == 'BUTTON') {
      return menu.children[0]
    }
    return menu
  }
}
