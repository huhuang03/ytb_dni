// bad name
export interface ElementGlobalFinder {
  find(): HTMLElement | null
}

export interface ElementFinder {
  find(parent: HTMLElement): HTMLElement | null
}

export class EmptyElementFinder implements ElementByQueryFinder {
    selector: string;
    find(_parent: HTMLElement): HTMLElement {
      return null
    }
}

export class ElementByQueryFinder implements ElementFinder {
  selector: string = ''

  constructor(selector: string) {
    this.selector = selector
  }

  find(parent: HTMLElement): HTMLElement | null {
    return parent.querySelector(this.selector)
  }
}
