import {HtmlElementWrapper} from './common/html_element_wrapper';
import {waitElement} from './util/util_wait';
import {eleIsShowing} from './util/util';

export class TellUsWhyDialog extends HtmlElementWrapper {

  constructor(ele: HTMLElement) {
    super(ele);
  }

  static has(): boolean {
    const root = getRootElement()
    return eleIsShowing(root)
  }


  static wait(callback: (dialog: TellUsWhyDialog) => void) {
    waitElement({
      check: getRootElement,
      run: (ele) => {
        if (!ele) {
          return
        }
        callback(new TellUsWhyDialog(ele))
      }
    })
  }

  /**
   * check that I don't like the video and then click submit.
   * submit button has enable and disable state. This find the enable element
   */
  clickAndSubmitDontLike() {
    waitElement({
      check: () => this.notLikeCheckbox(),
      run: (notLike) => {
        notLike.click()
        setTimeout(() => {
            const confirm = TellUsWhyDialog.submitButton(this.ele)
            if (!confirm) {
              console.error('no confirm')
              return
            }
            confirm.click()
        }, 50)
      }
    })
  }

  notLikeCheckbox() {
    const reasons = this.ele.querySelector('div[id="reasons"]') as HTMLElement
    const notLikeReason = reasons.children[reasons.children.length - 1] as HTMLElement
    if (!notLikeReason) {
      return null
    }
    return (notLikeReason.querySelector("#checkboxContainer") as HTMLElement)
  }

  static submitButton(root: HTMLElement) {
    if (!root) {
      return null
    }
    const buttons = root.querySelector('div[id="buttons"]') as HTMLElement
    if (!buttons || buttons.children.length == 0) {
      return null
    }
    const buttonContainer = buttons.children[buttons.children.length - 1] as HTMLElement
    // why buttonContainer has value but buttonContainer.querySelector("div.yt-spec-touch-feedback-shape__fill") not?
    return (buttonContainer.querySelector("div.yt-spec-touch-feedback-shape__fill") as HTMLElement)
  }
}

function getRootElement(): HTMLElement | null {
  return document.querySelector('tp-yt-paper-dialog[role="dialog"]') as HTMLElement | null
}
