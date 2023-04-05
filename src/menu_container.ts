import {Ele_wrapper} from './ele_wrapper';
import {DNI} from './dni';

/**
 * This MenuContainer is the direct container of DNI
 *
 * And for now, it mantians flexDirection.
 *
 * its ele is the dni parent.
 */
export class MenuContainer extends Ele_wrapper {
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
    console.log("setMenu called")
    if (this.dni == null) {
      return;
    }

    // why dni is null??
    this.dni.ele.onclick = () => {
      this._doNotInterest(menuFinder)
    }
  }

  _doNotInterest(menuFinder) {
    const btMenu = menuFinder()
    btMenu.click()

    setTimeout(() => {
      const popup_menu_items = document.querySelectorAll('ytd-menu-service-item-renderer')

      function getDNIElement(popup_menu_items) {
        if (popup_menu_items == null) return null;

        if (popup_menu_items.length == 1) {
          return popup_menu_items[0]
          // 目前有两种情况，6个和7个，都是倒数第三个为我们要找的item
        } else if (popup_menu_items.length >= 3) {
          return popup_menu_items[popup_menu_items.length - 3]
        }
        return null;
      }

      const ele = getDNIElement(popup_menu_items);
      if (ele != null) {
        ele.click()
      }
    }, 3)
  }

}
