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

const notInterestedStrList = ['Not interested', 'Не интересует']

function _isNotInterested(str: string | null | undefined) {
  return notInterestedStrList.includes((str || '').trim())
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
      if (_isNotInterested(elementText.trim())) {
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
      if (_isNotInterested(elementText.trim())) {
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
      if (_isNotInterested(elementText.trim())) {
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
      // <path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1Zm0 2a9 9 0 018.246 12.605L4.755 6.661A8.99 8.99 0 0112 3ZM3.754 8.393l15.491 8.944A9 9 0 013.754 8.393Z"></path>
      if (d && (d.includes('M12 2c5.52 0') || d.startsWith('M12 1C5.925 1 1 5.925'))) {
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
