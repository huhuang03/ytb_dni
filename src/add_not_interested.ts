import {Ele_wrapper} from './ele_wrapper';
import {MenuContainer} from './menu_container';
import {SVG_ID} from './constants';
import {waitAndDo} from './util';

class PreviewMenu extends Ele_wrapper {
    constructor(root) {
        super(root)
        this._init()
    }

    _init() {
        const containerEle = this._getContainer();
        if (containerEle == null) {
            return
        }

        const dniContainer = new MenuContainer(containerEle)
        dniContainer.setMenu(() => containerEle.querySelector("yt-icon-button.dropdown-trigger").querySelector("#button"))
    }

    _getContainer() {
        // how do you think of this?
        const containers = this.ele.getElementsByTagName("ytd-menu-renderer")
        log("containers: " + containers)
        if (containers != null && containers.length > 0) {
            return containers[0]
        }
        return null
    }
}

/**
 * 每个item就是一个要处理的是视频item
 */
class Item extends Ele_wrapper {
    canAddBt = false
    constructor(ele) {
        super(ele)
        this._init()
    }

    _init() {
        this.canAddBt = this.ele.offsetWidth > 0

        if (this.canAddBt) {
            waitAndDo(() => {
                const menuContainer = this.ele.querySelector("ytd-menu-renderer.style-scope.ytd-rich-grid-media")
                const dniContainer = new MenuContainer(menuContainer);

                dniContainer.setMenu(() => this.ele.querySelector("button.style-scope.yt-icon-button"))
            }, () => {
                return this.ele && this.ele.querySelector("ytd-menu-renderer.style-scope.ytd-rich-grid-media")
            }, 10000, 500)
        }
    }


}

function getDetails() {
    let details = Array.from(document.querySelectorAll("ytd-rich-grid-media div .style-scope.ytd-rich-grid-media"))
    details = details.filter(d => d.id === "details")
    return details
}

function logw(...args) {
    console.log.apply(null, ...args)
}

function log(...args: any[]) {
    if (true) {
        console.log.apply(null, args)
    }
}

function run() {
    let details = getDetails()
    log("details len: " + details.length, "is Ytb home: ", isYtbHome())
    details.map(d => {
        if (isYtbHome()) {
            new Item(d)
        }
    })
}

function _initPreview() {
    if ((window as any)._has_init_preview) {
        return;
    }

    (window as any)._has_init_preview = true;
    setTimeout(() => {
        // 这里可能有错误啊
        const preview = document.getElementById("preview")
        // how to handle this?
        // the menu is not ready!
        const menu = preview.querySelector("#menu")
        if (menu == null) {
            return
        }

        const handlePreviewChange = function (mutationsList, observer) {
            log("hanldePeviewChange called ----------")

            for (let mutation of mutationsList) {
                log("mutation: " + mutation.type)
                // how do you think??
                setTimeout(() => {
                    new PreviewMenu(menu)
                }, 0)
            }
        }

        const observer = new MutationObserver(handlePreviewChange)
        observer.observe(menu, { childList: true })
    }, 1000)
}

function _getContentElement() {
    let contents = document.querySelectorAll("[id=contents]")
    if (!contents || contents.length === 0) {
        return undefined;
    }

    if (contents && contents.length > 0) {
        for (let ele of Array.from(contents)) {
            if (ele.clientWidth) {
                return ele
            }
        }
    }
    return undefined;
}

function _initItems() {
    run()
    const e_content = _getContentElement()
    if (e_content) {
        // not work anymore. why?
        log('set MutationObserver called')
        new MutationObserver(() => {
            log("MutationObserver callback called")
            // how to do this?
            if (isYtbHome()) {
                run()
            }
        }).observe(e_content, {
            childList: true,
        })
    } else {
        logw("why content is null??")
    }
}

// some things it's too early this get called.
// should wait for the content is ready!!
function _initial() {
    log("_initial caleld")
    if (!isYtbHome()) {
        log("is not ytb home, just return")
        return
    }

    if ((window as any)._has_add_ytb_dni) {
        logw("ytb has already initialed!!")
        return
    }

    // 如果是从详情点击图片返回的，有两个contents
    // <div id="contents" class="style-scope ytd-item-section-renderer"></div>
    (window as any)._has_add_ytb_dni = true

    _initPreview()

    // ok how to do this?
    waitAndDo(() => {
        _initItems()
    }, () => {
        return _getContentElement() != null && getDetails().length > 0
    }, 4000, 500)
}

function isYtbHome() {
    const location = window.location
    log("location1: " + location)
    return location && (location.pathname == "/" || location.pathname == "")
}

setTimeout(_initial, 0)

// can you inject css not like this!!
// this will not change!!
function _addCss() {
    // add css
    const fillColor = 'var(--ytd-menu-renderer-button-color, var(--yt-spec-icon-inactive))';
    // const fillHoverColor = 'var(--ytd-menu-renderer-button-color, var(--yt-spec-icon))';
    const fillHoverColor = 'var(--ytd-menu-renderer-button-color, var(--yt-spec-icon-active-other))';

    let css = `#${SVG_ID}:hover {fill: ${fillHoverColor}}\n #${SVG_ID} {fill: ${fillColor};}`;
    // let css = `#${SVG_ID}:hover {fill: #606060}\n #${SVG_ID} {fill: #8b8b8b}`
    let style = document.createElement('style') as any;

    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    document.getElementsByTagName('head')[0].appendChild(style);
}

_addCss()
