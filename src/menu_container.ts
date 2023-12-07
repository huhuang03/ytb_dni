import {EleWrapper} from './ele_wrapper';
import {DNI} from './dni';
import {DniButtonFinder} from './dni_button_finder';

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
  dniButtonFinder: DniButtonFinder

  // ele is the menuContainer
  constructor(ele) {
    super(ele)
    this.dniButtonFinder = new DniButtonFinder(this)
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
    return this.dniButtonFinder.findDni()
  }

  _doNotInterest(menuFinder) {
    const btMenu = menuFinder()
    btMenu.click()
    let found = false
    const beginTime = new Date().getTime()

    const check = () => {
      if (found) {
        return
      }
      const findEle = this._smart_check_once()
      if (findEle) {
        found = true
        findEle.click()
      } else {
        if ((new Date().getTime() - beginTime) < 2000) {
          setTimeout(check, 20)
        }
      }
    }

    setTimeout(check, 50)
  }

}
