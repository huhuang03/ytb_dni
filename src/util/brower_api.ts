declare var chrome: any
declare var browser: any

// noinspection JSUnusedGlobalSymbols
export const isFirefox = typeof browser !== 'undefined'

export const isChrome = typeof chrome !== 'undefined'

export const browserApi = typeof browser !== 'undefined' ? browser : chrome;
