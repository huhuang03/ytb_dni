import {MenuContainer} from './menu_container';

export class DniButtonFinder {
  constructor(menuContainer: MenuContainer) {
  }

  private findItemParent(partContent: Element): HTMLElement | null {
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
      const elementText = ele.textContent || (ele instanceof HTMLElement && ele.innerText);
      if (elementText.trim() === 'Not interested') {
        return this.findItemParent(ele)
      }
    }
    return null
  }

  private findByPath(): HTMLElement | null {
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
    const finders= [this.findByText, this.findByPath]
    for (const finder of finders) {
      const find = finder.apply(this)
      if (find) {
        return find
      }
    }
    return null
  }

}
