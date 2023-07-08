import {EleWrapper} from './ele_wrapper';
import {DNI} from './dni';

/**
 * This MenuContainer is the direct container of DNI
 *
 * And for now, it mantians flexDirection.
 *
 * its ele is the dni parent.
 */
export class MenuContainer extends EleWrapper {
  dni: DNI
  hasAdded = false

  // ele is the menuContainer
  constructor(ele) {
    super(ele)
    this.dni = null
    this._init()
  }

  _init() {
    this.hasAdded = this.ele.style.flexDirection === 'column'

    if (!this.hasAdded) {
      this.ele.style.flexDirection = 'column'

      this.dni = new DNI()
      this.ele.append(this.dni.ele)
    }
  }

  setMenu(menuFinder) {
    if (this.dni == null) {
      return;
    }

    // why dni is null??
    this.dni.ele.onclick = () => {
      this._doNotInterest(menuFinder)
    }
  }

  _smart_check_once(): HTMLElement | null {
    const popup_menu_items = document.querySelectorAll('ytd-menu-service-item-renderer')

    for (const item of Array.from(popup_menu_items)) {
      const path = item.querySelector('path')
      if (path) {
        const d = path.getAttribute('d')
        //  M18.71 6C20.13 7.59 21 9.69 21 12c0 4.97-4.03 9-9 9-2.31 0-4.41-.87-6-2.29L18.71 6zM3 12c0-4.97 4.03-9 9-9 2.31 0 4.41.87 6 2.29L5.29 18C3.87 16.41 3 14.31 3 12zm9-10c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z
        if (d && d.includes('6C20')) {
          return item as HTMLElement
        }
      }
    }
    return null
  }

  _doNotInterest(menuFinder) {
    const btMenu = menuFinder()
    btMenu.click()
    let found = false

    const check = () => {
      if (found) {
        return
      }
      const findEle = this._smart_check_once()
      if (findEle) {
        found = true
        findEle.click()
      } else {
        setTimeout(check, 20)
      }
    }

    setTimeout(check, 50)
  }

}
