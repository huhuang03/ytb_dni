import {HtmlElementWrapper} from './common/html_element_wrapper';
import {checkThenDo} from './util/util';
import {MenuContainer} from './menu_container';
import {ElementFinder} from './common/element_finder';
import {SVG_ID} from './constants';
import {log} from './util/util_log';
import {createRafScheduler} from './util/util_raf';

export class CardWrapper extends HtmlElementWrapper {
  menuContainerFinder: ElementFinder
  buttonFinder: ElementFinder
  checkClickReason = true
  marginTop = 0

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
    this.marginTop = marginTop
    this._add()
    this._initListener()
  }


  /**
   * for redo put the dni back
   */
  _initListener() {
    if (this.ele.dataset.__has_init_ytb_listener) {
      return
    }
    this.ele.dataset.__has_init_ytb_listener = '1'

    const scheduleAdd = createRafScheduler(() => {
      this._add()
    })

    new MutationObserver(() => {
      scheduleAdd()
    }).observe(this.ele, {
      childList: true,
      subtree: true,
    })
  }

  _add() {
    if (!this.ele.isConnected) return;
    const canAddBt = this.ele.offsetWidth > 0;
    if (!canAddBt) return;
    const menuContainer = this.menuContainerFinder.find(this.ele);
    if (!menuContainer) return;

    const found = menuContainer.querySelector(`#${SVG_ID}`);
    if (found) return;
    const dniContainer = new MenuContainer(
      menuContainer,
      this.marginTop,
      this.checkClickReason
    );
    log('dniContainer called!!!!')
    dniContainer.setMenu(() => this.buttonFinder.find(this.ele));
  }
}
