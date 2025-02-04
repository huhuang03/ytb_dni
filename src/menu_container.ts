import {HtmlElementWrapper} from './common/html_element_wrapper';
import {DNI} from './dni';
import {DniButtonFinder} from './dni_button_finder';
import {findParent} from './util/util';
import {TellUsWhyDialog} from './tell_us_why_dialog';
import {KEY_TELL_US_WHY} from './common/constants';
import {waitBoolean, waitElement} from './util/util_wait';

declare var chrome: any

/**
 * This wrap the menu container, and can add a dni button
 *
 * This MenuContainer is the direct container of DNI
 *
 * And for now, it maintains flexDirection.
 *
 * its ele is the dni parent.
 *
 * There's two type of this. One is normal, one is for playlist
 */
export class MenuContainer extends HtmlElementWrapper {
  dni: DNI | null = null
  hasAdded = false
  dniButtonFinder: DniButtonFinder
  marginTop = 0

  // ele is the menuContainer
  constructor(ele: HTMLElement, marginTop = 0) {
    super(ele)
    this.dniButtonFinder = new DniButtonFinder()
    this.marginTop = marginTop
    this.dni = null
    this._init()
  }

  _init() {
    this.hasAdded = this.ele.style.flexDirection === 'column'

    if (!this.hasAdded) {
      this.ele.style.flexDirection = 'column'

      this.dni = new DNI(this.marginTop)
      this.ele.append(this.dni.ele)
    }
  }

  setMenu(menuFinder: any) {
    if (this.dni == null) {
      return;
    }

    this.dni.ele.onclick = (e) => {
      e.stopPropagation()
      this._doNotInterest(menuFinder)
    }
  }

  _smart_check_once(): HTMLElement | null {
    return this.dniButtonFinder.findDni()
  }

  _doNotInterest(menuFinder: () => any) {
    const btMenu = menuFinder()
    btMenu.click()
    let found = false
    const beginTime = new Date().getTime()

    const check = () => {
      if (found) {
        return
      }
      const findEle = this._smart_check_once()
      console.log('findEle: ', findEle)
      if (findEle) {
        found = true
        findEle.click()
        this.clickTellUsWhy().then(() => {})
      } else {
        if ((new Date().getTime() - beginTime) < 2000) {
          setTimeout(check, 20)
        }
      }
    }

    setTimeout(check, 50)
  }

  private async isOptionTellUsWhyOn(): Promise<Boolean> {
    let res = await chrome.storage.local.get({[KEY_TELL_US_WHY]: false});
    return res[KEY_TELL_US_WHY];
  }

  /**
   * Get this item root
   * @private
   */
  private getDismissedRoot(): HTMLElement | null {
    const root = this.getRoot()
    if (!root) {
      return null
    }
    return root.querySelector('div[id="dismissed-content"]')
  }

  private getRoot(): HTMLElement | null {
    return findParent(this.ele,
      (e) => e.tagName === 'YTD-RICH-GRID-MEDIA')
  }

  /**
   * click tell us why, and then I don't like this video.
   * @private
   */
  private async clickTellUsWhy() {
    const isOn = await this.isOptionTellUsWhyOn()
    if (!isOn) {
      return
    }

    const itemRoot = this.getDismissedRoot()
    if (!itemRoot) {
      return
    }

    waitElement({
      check: () => this.getTellUsWhyButton(itemRoot),
      run: button => {
        this.clickTellUsWhyButton(button)
      }
    })
  }

  /**
   * look like we can't click too early, otherwise look like the onclick event is not set,
   * So try many times
   * @private
   */
  private clickTellUsWhyButton(button: HTMLElement,
                               checkWait = 200,
                               curTimes = 0) {
    const tryTotalTimes = 3

    setTimeout(() => {
      button.click()
      waitBoolean({
        timeout: 500,
        check: TellUsWhyDialog.has,
        run: () => {
          TellUsWhyDialog.wait((dialog) => {
            dialog.clickAndSubmitDontLike()
          })
        },
        timeoutRun: () => {
          if (curTimes >= tryTotalTimes) {
            console.error('can not find tell us button')
          } else {
            this.clickTellUsWhyButton(button, 100, curTimes + 1)
          }
        }
      })
    }, checkWait)
  }


  private getTellUsWhyButton(itemContainer: HTMLElement) {
    const buttons = itemContainer.querySelector('div[id="dismissed-content"] ytd-notification-multi-action-renderer div[id="buttons"]') as HTMLElement | null
    if (!buttons) {
      return null
    }
    const buttonContainer =  buttons.children[buttons.children.length - 1] as HTMLElement
    return buttonContainer.querySelector("div.yt-spec-touch-feedback-shape__fill") as HTMLElement
  }

}
