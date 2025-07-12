declare var chrome: any
declare var browser: any

export const browserApi = typeof browser !== 'undefined' ? browser : chrome;
