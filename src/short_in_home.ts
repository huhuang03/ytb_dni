import {ElementFinder} from './common/element_finder';
import {CardWrapper} from './card_wrapper';

const _buttonFinder: ElementFinder = {
  find(item: HTMLElement) {
    return item.querySelector("button")
  }
}


const _menuContainerFinder: ElementFinder = {
  find(item: HTMLElement) {
    return _buttonFinder.find(item)?.parentElement || null
  }
}

export class ShortInHome extends CardWrapper {

  /**
   * @param ele ele 应该是desc的container
   * @param menuContainerFinder
   * @param menuFinder
   */
  constructor(
    ele: HTMLElement) {
    super(ele, _menuContainerFinder, _buttonFinder, false)
  }
}
