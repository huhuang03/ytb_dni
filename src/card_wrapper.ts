import {HtmlElementWrapper} from './common/html_element_wrapper';
import {checkThenDo} from './util/util';
import {MenuContainer} from './menu_container';
import {ElementFinder} from './common/element_finder';
import {SVG_ID} from './constants';

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
    if (!this.ele.isConnected) return;
    if (this.ele.dataset.__has_init_dni === '1') {
      return
    }
    this.ele.dataset.__has_init_dni = '1'

    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (!this.ele.isConnected) return;
      if (scheduled) return;

      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;

        const canAddBt = this.ele.offsetWidth > 0;
        if (!canAddBt) return;

        const menuContainer = this.menuContainerFinder.find(this.ele);
        if (!menuContainer) return;

        const found = menuContainer.querySelector(`#${SVG_ID}`);
        if (found) return;

        const dniContainer = new MenuContainer(
          menuContainer,
          marginTop,
          this.checkClickReason
        );

        dniContainer.setMenu(() => this.buttonFinder.find(this.ele));
      });
    });
    observer.observe(this.ele, {childList: true, subtree: true})
  }
}
