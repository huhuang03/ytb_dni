// how to avoid redefine?
var SVG_ID = "not_interested_svg"

// 不断调用checkFunc。一旦返回ture，则调用func
function waitAndDo(func, checkFunc, timeout, checkInterval = 50) {
    let startTime = new Date().getTime()
    _waitAndDoOnce(startTime, func, checkFunc, timeout, checkInterval)
}

function _waitAndDoOnce(startTime, func, checkFunc, timeout, checkInterval) {
    setTimeout(() => {
        if (checkFunc()) {
            func()
        } else if ((new Date().getTime() - startTime) < timeout) {
            _waitAndDoOnce(startTime, func, checkFunc, timeout, checkInterval)
        }
    }, checkInterval)
}

class EleWrapper {
    constructor(ele) {
        this.ele = ele
    }
}

/**
 * This DniContainer is the direct container of DNI
 * 
 * And for now, it mantians flexDirection.
 * 
 * it's ele is the dni parent.
 */
class DniContainer extends EleWrapper {
    constructor(ele) {
        super(ele)
        this.dni = null
        this._init()
    }

    _init() {
        // 处理完之后会将此值改为 "column"。如果修改过。则不会重复修改了
        this.hasAdded = this.ele.style.flexDirection == "column"

        if (!this.hasAdded) {
            // how to reuse this tecnic?
            this.ele.style.flexDirection = "column"

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

    _doNotInterest(menuFinder) {
        const btMenu = menuFinder()
        btMenu.click()

        setTimeout(() => {
            const popup_menu_items = document.querySelectorAll("ytd-menu-service-item-renderer")

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

class DNI extends EleWrapper {
    // how do you do this?
    constructor() {
        super(null)
        this.ele = this._createDniButton()
    }

    // it's something not interesting??
    _createDniButton() {
        let button = document.createElement("button");
        button.setAttribute("class", "style-scope yt-icon-button ytd-menu-renderer")
        // button.setAttribute("style-target", "button")

        let svg = this._createSvg()
        svg.setAttribute("id", SVG_ID)
        button.appendChild(svg)
        return button
    }

    // 创建svg。即那个圆圈中加一杠图案
    _createSvg() {
        function getNode(n, v) {
            n = document.createElementNS("http://www.w3.org/2000/svg", n);
            for (let p in v)
                n.setAttributeNS(null, p.replace(/[A-Z]/g, function(m, p, o, s) { return "-" + m.toLowerCase(); }), v[p]);
            return n
        }

        let width = 24
        let height = width

        let svg = getNode("svg", {width: width, height: height});
        let padding = 2
        svg.setAttribute('viewBox', `-${padding} -${padding} ${width + padding * 2} ${height + padding * 2}`)
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
        document.body.insertBefore(svg, document.body.firstChild);


        let g = getNode('g', {class: ''});
        svg.appendChild(g)

        let path1 = getNode("path", {d: 'M0 0h24v24H0z', fill: 'none', class: 'style-scope yt-icon'})
        let path2 = getNode("path", {d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z',
            class: 'style-scope yt-icon'})
        g.appendChild(path1)
        g.appendChild(path2)
        return svg
    }
}


class PreviewMenu {
    constructor(root) {
        this.ele = root
        this._init()
    }

    _init() {
        const containerEle = this._getContainer();
        if (containerEle == null) {
            return
        }

        const dniContainer = new DniContainer(containerEle)
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

// can I split to some method
// can I do some helper method?
// split change and unchange.
// I think the dni is unot change.

/**
 * 每个item就是一个要处理的是视频item
 */
class Item extends EleWrapper{
    constructor(ele) {
        super(ele)
        this._init()
    }

    _init() {
        // get child??
        // offsetWidth > 0 表示视图已经加载完成了。
        this.canAddBt = this.ele.offsetWidth > 0

        if (this.canAddBt) {
            waitAndDo(() => {
                const menuContainer = this.ele.querySelector("ytd-menu-renderer.style-scope.ytd-rich-grid-media")
                const dniContainer = new DniContainer(menuContainer);

                // const btMenu = this.ele.querySelector("button.style-scope.yt-icon-button")
                dniContainer.setMenu(() => this.ele.querySelector("button.style-scope.yt-icon-button"))
                // dniContainer.dni.ele.onclick = () => {
                //     this.doNotInterest()
                // }
            }, () => {
                return this.ele.querySelector("ytd-menu-renderer.style-scope.ytd-rich-grid-media") != null
            }, 4000)
        }
    }


}

function getDetails() {
    let details = Array.from(document.querySelectorAll("ytd-rich-grid-media div .style-scope.ytd-rich-grid-media"))
    details = details.filter(d => d.id === "details")
    return details
}

function logw() {
    console.log.apply(null, arguments)
}

function log() {
    if (true) {
        console.log.apply(null, arguments)
    }
}

function run() {
    let details = getDetails()
    log("details len: " + details.length)
    details.map(d => {
        if (isYtbHome()) {
            new Item(d)
        }
    })
}

function _initPreview() {
    if (window._has_init_preview) {
        return;
    }

    window._has_init_preview = true;
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

            for (mutation of mutationsList) {
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
        for (let ele of contents) {
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

    if (window._has_add_ytb_dni) {
        logw("ytb has already initialed!!")
        return
    }

    // 如果是从详情点击图片返回的，有两个contents
    // <div id="contents" class="style-scope ytd-item-section-renderer"></div>
    window._has_add_ytb_dni = true

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
    let style = document.createElement('style');

    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    document.getElementsByTagName('head')[0].appendChild(style);
}

_addCss()