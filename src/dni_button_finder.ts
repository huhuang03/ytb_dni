import {ElementGlobalFinder} from './common/element_finder';
import {eleIsShowing} from './util/util';

function findItemParent(partContent: Element | null): HTMLElement | null {
  if (!partContent) {
    return null
  }
  if (partContent instanceof HTMLElement && partContent.tagName === 'YT-LIST-ITEM-VIEW-MODEL') {
    return partContent
  }
  return findItemParent(partContent.parentElement)
}

class YtbShortDniButtonFinderBySvg implements ElementGlobalFinder {
  find(): HTMLElement | null {
    const pathList = document.querySelectorAll('ytd-popup-container yt-sheet-view-model svg path')
    for (const item of Array.from(pathList)) {
      const d = item.getAttribute('d')
      // M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48
      if (d && d.includes('M12 2c5.52 0 10 4.48')) {
        return findItemParent(item)
      }
    }
    return null
  }
}

/**
 * The dni button finder, and it's shorts menu
 */
class YtbShortDniButtonFinderByText implements ElementGlobalFinder {

  find(): HTMLElement | null {
    const allStr = document.querySelectorAll('yt-core-attributed-string')
    for (let i = 0; i < allStr.length; i++) {
      const ele = allStr[i]
      const elementText = ele.textContent || (ele instanceof HTMLElement && ele.innerText || '');
      if (elementText.trim() === 'Not interested') {
        return findItemParent(ele)
      }
    }
    return null
  }
}

class PlayingMenuFinder implements ElementGlobalFinder {
  find(): HTMLElement | null {
    return this.findParent(this.findByTextWhenInPlay())
  }

  private findParent(child: HTMLElement | null): HTMLElement | null {
    if (!child) {
      return null
    }
    if (child.tagName === 'YT-LIST-ITEM-VIEW-MODEL') {
      return child
    }
    return this.findParent(child.parentElement || null)
  }

  // when there are some float playing, the menu is different
  private findByTextWhenInPlay(): HTMLElement | null {
    const allStr = document.querySelectorAll('tp-yt-iron-dropdown yt-list-view-model yt-list-item-view-model')
    for (let i = 0; i < allStr.length; i++) {
      const ele = allStr[i]
      const elementText = ele.textContent || (ele instanceof HTMLElement && ele.innerText || '');
      if (elementText.trim() === 'Not interested') {
        return this.findParent(ele as HTMLElement)
      }
    }
    return null
  }
}

// find dni button in menu
export class DniButtonFinder {
  constructor() {
  }

  private findItemParent(partContent: Element | null): HTMLElement | null {
    if (!partContent) {
      return null
    }
    if (partContent instanceof HTMLElement && partContent.tagName === 'YTD-MENU-SERVICE-ITEM-RENDERER') {
      return partContent
    }
    return this.findItemParent(partContent.parentElement)
  }


  private findByText(): HTMLElement | null {
    const allStr = document.querySelectorAll('ytd-menu-service-item-renderer yt-formatted-string')
    for (let i = 0; i < allStr.length; i++) {
      const ele = allStr[i]
      const elementText = ele.textContent || (ele instanceof HTMLElement && ele.innerText || '');
      if (elementText.trim() === 'Not interested') {
        // return this.findItemParent(ele)
      }
    }
    return null
  }

  private findByPath(): HTMLElement | null | undefined {
    const pathList = document.querySelectorAll('ytd-menu-service-item-renderer path')
    for (const item of Array.from(pathList)) {
      const d = item.getAttribute('d')
      // M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48
      if (d && d.includes('M12 2c5.52 0')) {
        return this.findItemParent(item)
      }
    }
  }

  public findDni(): HTMLElement | null {
    const finders = [this.findByText, this.findByPath]
    for (const finder of finders) {
      const find = finder.apply(this)
      if (find && eleIsShowing(find)) {
        return find
      }
    }

    const finders1 = [new YtbShortDniButtonFinderByText(), new YtbShortDniButtonFinderBySvg(), new PlayingMenuFinder()]
    for (let finder of finders1) {
      const found = finder.find()
      if (found && eleIsShowing(found)) {
        return found
      }
    }
    return null
  }

}
