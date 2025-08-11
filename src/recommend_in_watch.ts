import {ElementFinder} from './common/element_finder';
import {CardWrapper} from './card_wrapper';

const _buttonViewModelFinder: ElementFinder = {
  find(item) {
    return item.querySelector("yt-lockup-metadata-view-model button-view-model")
  }
}

const _menuContainerFinder: ElementFinder = {
  find(item: HTMLElement) {
    return _buttonViewModelFinder.find(item)?.parentElement || null
  }
}

const _buttonFinder: ElementFinder = {
  find(item: HTMLElement) {
    return _buttonViewModelFinder.find(item)?.querySelector("button") || null
  }
}

export class RecommendInWatch extends CardWrapper {

  /**
   * @param ele ele 应该是desc的container
   * @param menuContainerFinder
   * @param menuFinder
   */
  constructor(
    ele: HTMLElement) {
    super(ele, _menuContainerFinder, _buttonFinder, true)
  }
}
