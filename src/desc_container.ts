import {HtmlElementWrapper} from './common/html_element_wrapper';
import {checkThenDo} from './util/util';
import {MenuContainer} from './menu_container';

/**
 * 每个item就是一个要处理的是视频item
 */
export class ItemContainer extends HtmlElementWrapper {
  canAddBt = false
  menuQuerySelector = 'ytd-menu-renderer'

  /**
   * @param ele ele 应该是desc的container
   */
  constructor(ele: HTMLElement) {
    super(ele)
  }

  init(marginTop=0) {
    this.canAddBt = this.ele.offsetWidth > 0

    if (this.canAddBt) {
      checkThenDo(() => {
        const menuContainer = this.ele.querySelector(this.menuQuerySelector)
        // @ts-ignore
        const dniContainer = new MenuContainer(menuContainer, marginTop);

        dniContainer.setMenu(() => this.ele.querySelector('button.style-scope.yt-icon-button'))
      }, () => {
        return this.ele && !!this.ele.querySelector(this.menuQuerySelector)
      }, 10000, 500)
    }
  }
}
