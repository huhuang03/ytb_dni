import {EleWrapper} from './ele_wrapper';
import {busyWaitThenDo} from './util';
import {MenuContainer} from './menu_container';

/**
 * 每个item就是一个要处理的是视频item
 */
export class DescContainer extends EleWrapper {
  canAddBt = false
  menuQuerySelector = 'ytd-menu-renderer'

  constructor(ele) {
    super(ele)
  }

  init() {
    this.canAddBt = this.ele.offsetWidth > 0

    if (this.canAddBt) {
      busyWaitThenDo(() => {
        const menuContainer = this.ele.querySelector(this.menuQuerySelector)
        const dniContainer = new MenuContainer(menuContainer);

        dniContainer.setMenu(() => this.ele.querySelector('button.style-scope.yt-icon-button'))
      }, () => {
        return this.ele && this.ele.querySelector(this.menuQuerySelector)
      }, 10000, 500)
    }
  }
}
