import {HtmlElementWrapper} from './common/html_element_wrapper';
import {checkThenDo} from './util/util';
import {MenuContainer} from './menu_container';
import {ElementFinder} from './common/element_finder';

export class CardWrapper extends HtmlElementWrapper {
  canAddBt = false
  menuContainerFinder: ElementFinder
  buttonFinder: ElementFinder
  checkClickReason = true

  /**
   * @param ele ele 应该是desc的container
   * @param menuContainerFinder
   * @param buttonFinder
   */
  constructor(
    ele: HTMLElement,
    menuContainerFinder: ElementFinder,
    buttonFinder: ElementFinder,
    checkClickReason = true) {
    super(ele)
    this.menuContainerFinder = menuContainerFinder
    this.buttonFinder = buttonFinder
    this.checkClickReason = checkClickReason
  }

  init(marginTop = 0) {
    this.canAddBt = this.ele.offsetWidth > 0

    if (this.canAddBt) {
      checkThenDo(() => {
        const menuContainer = this.menuContainerFinder.find(this.ele)
        // @ts-ignore
        const dniContainer = new MenuContainer(menuContainer, marginTop, this.checkClickReason);
        dniContainer.setMenu(() => this.buttonFinder.find(this.ele))
      }, () => {
        return this.ele && !!this.menuContainerFinder.find(this.ele)
      }, 10000, 500)
    }
  }
}
