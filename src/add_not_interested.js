let SVG_ID = "not_interested_svg"

function addCss() {
    // add css
    const fillColor = 'var(--ytd-menu-renderer-button-color, var(--yt-spec-icon-inactive))';
    // const fillHoverColor = 'var(--ytd-menu-renderer-button-color, var(--yt-spec-icon))';
    const fillHoverColor = 'var(--ytd-menu-renderer-button-color, var(--yt-spec-icon-active-other))';

    let css = `#${SVG_ID}:hover {fill: ${fillHoverColor}}\n #${SVG_ID} {fill: ${fillColor}}`;
    // let css = `#${SVG_ID}:hover {fill: #606060}\n #${SVG_ID} {fill: #8b8b8b}`
    let style = document.createElement('style');

    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    document.getElementsByTagName('head')[0].appendChild(style);
}

addCss()

/**
 * 每个item就是一个要处理的是视频item
 */
class Item {
    constructor(root) {
        /**
         * root为视频介绍的根节点。
         */
        this.root = root
        this.init()
    }

    init() {
        // offsetWidth > 0 表示视图已经加载完成了。
        this.canAddBt = this.root.offsetWidth > 0

        if (this.canAddBt) {
            this.waitAndDo(() => {
                this.frontMentuContainer = this.root.querySelector("ytd-menu-renderer.style-scope.ytd-rich-grid-media")
                // 处理完之后会将此值改为 "column"。如果修改过。则不会重复修改了
                this.hasAdded = this.frontMentuContainer.style.flexDirection == "column"

                if (!this.hasAdded) {
                    this.frontMentuContainer.style.flexDirection = "column"
                    this.btMenu = this.root.querySelector("button.style-scope.yt-icon-button")

                    let button = this.createButton(this.btMenu)
                    button.onclick = () => {
                        this.doNotInterest()
                    }
                    this.frontMentuContainer.append(button)
                }
            }, () => {
                return this.root.querySelector("ytd-menu-renderer.style-scope.ytd-rich-grid-media") != null
            }, 4000)
        }
    }

    _innerWaitAndDo(startTime, func, checkFunc, timeout, checkInterval) {
        setTimeout(() => {
            if (checkFunc()) {
                func()
            } else if ((new Date().getTime() - startTime) < timeout) {
                this._innerWaitAndDo(startTime, func, checkFunc, timeout, checkInterval)
            }
        }, checkInterval)
    }


    // 不断调用checkFunc。一旦返回ture，则调用func
    waitAndDo(func, checkFunc, timeout, checkInterval = 50) {
        let startTime = new Date().getTime()
        this._innerWaitAndDo(startTime, func, checkFunc, timeout, checkInterval)
    }

    doNotInterest() {
        this.btMenu.click()
        setTimeout(() => {
            this.popup_menu_items = document.querySelectorAll("ytd-menu-service-item-renderer")

            // svg path: M18.71 6C20.13 7.59 21 9.69 21 12c0 4.97-4.03 9-9 9-2.31 0-4.41-.87-6-2.29L18.71 6zM3 12c0-4.97 4.03-9 9-9 2.31 0 4.41.87 6 2.29L5.29 18C3.87 16.41 3 14.31 3 12zm9-10c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z
            // maybe use the svg path is better?
            function getDNIElement(popup_menu_items) {
                console.log("popup_menu_items: ", popup_menu_items)
                if (popup_menu_items == null) return null;

                if (popup_menu_items.length == 1) {
                    return popup_menu_items[0]
                    // 目前有两种情况，6个和7个，都是倒数第三个为我们要找的item
                } else if (popup_menu_items.length >= 3) {
                    return popup_menu_items[popup_menu_items.length - 3]
                }
                return null;
            }
            const ele = getDNIElement(this.popup_menu_items);
            if (ele != null) {
                ele.click()
            }
            // if (this.popup_menu_items.length >= 6) {
            //     this.popup_menu_items[3].click()
            // } else if (this.popup_menu_items.length == 1) {
            //     this.popup_menu_items[0].click()
            //     console.log(this.popup_menu_items[0])
            // }
        }, 3)
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

    createButton(btMenu) {
        let button = document.createElement("button");
        button.setAttribute("class", "style-scope yt-icon-button")

        let svg = this._createSvg()
        svg.setAttribute("id", SVG_ID)
        button.appendChild(svg)
        return button
    }
}

function getDetails() {
    let details = Array.from(document.querySelectorAll("ytd-rich-grid-media div .style-scope.ytd-rich-grid-media"))
    details = details.filter(d => d.id === "details")
    return details
}

function log() {
    if (true) {
        console.log.apply(null, arguments)
    }
}

function run() {
    let details = getDetails()
    log("details: ", details)
    details.map(d => new Item(d))
}

function _getContentElement(content_elements) {
    if (!content_elements || content_elements.length === 0) {
        return undefined;
    }
    if (content_elements && content_elements.length > 0) {
        for (let ele of content_elements) {
            if (ele.clientWidth) {
                return ele
            }
        }
    }
    return undefined;
}

function _initial() {
    run()
    log("window._has_add_ytb_dni", window._has_add_ytb_dni)
    if (!window._has_add_ytb_dni) {
        window._has_add_ytb_dni = true
        // 如果是从详情点击图片返回的，有两个contents
        // <div id="contents" class="style-scope ytd-item-section-renderer"></div>
        let e_contents = document.querySelectorAll("[id=contents]")
        const e_content = _getContentElement(e_contents)
        if (e_content) {
            // not work anymore. why?
            console.log('set MutationObserver called')
            new MutationObserver(() => {
                log("MutationObserver callback called")
                run()
            }).observe(e_content, {
                childList: true,
            })
        }
    }

    console.log("add_not_interested.js called.")
}

setTimeout(_initial, 0)
