import {HtmlElementWrapper} from './common/html_element_wrapper';
import {checkThenDo} from './util/util';
import {MenuContainer} from './menu_container';
import {ElementByQueryFinder, ElementFinder, EmptyElementFinder} from './common/element_finder';

/**
 * 每个item就是一个要处理的是视频item
 */
export class ItemContainer extends HtmlElementWrapper {
  canAddBt = false
  menuContainerFinder: ElementFinder = new EmptyElementFinder()
  menuFinder: ElementFinder = new EmptyElementFinder()

  /**
   * @param ele ele 应该是desc的container
   * @param menuContainerFinder
   * @param menuFinder
   */
  constructor(
    ele: HTMLElement,
    menuContainerFinder: ElementFinder = new ElementByQueryFinder('ytd-menu-renderer'),
    menuFinder: ElementFinder = new ElementByQueryFinder('button.style-scope.yt-icon-button')) {
    super(ele)
    this.menuContainerFinder = menuContainerFinder
    this.menuFinder = menuFinder
  }

  init(marginTop=0) {
    this.canAddBt = this.ele.offsetWidth > 0

    if (this.canAddBt) {
      checkThenDo(() => {
        const menuContainer = this.menuContainerFinder.find(this.ele)
        // @ts-ignore
        const dniContainer = new MenuContainer(menuContainer, marginTop);
        dniContainer.setMenu(() => this.menuFinder.find(this.ele))
      }, () => {
        return this.ele && !! this.menuContainerFinder.find(this.ele)
      }, 10000, 500)
    }
  }
}
