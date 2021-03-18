// console.log("add_not_interested.js called")
// how to do ??

class Item {
    constructor(root) {
        this.root = root
        this.init()
    }

    init() {
        this.canAddBt = this.root.offsetWidth > 0
        if (this.canAddBt) {
            // 还没加载完

            this.waitAndDo(() => {
                this.frontMentuContainer = this.root.querySelector("ytd-menu-renderer.style-scope.ytd-rich-grid-media")
                this.hasAdded = this.frontMentuContainer.style.flexDirection

                if (!this.hasAdded) {
                    this.frontMentuContainer.style.flexDirection = "column"
                    this.btMenu = this.root.querySelector("button.style-scope.yt-icon-button")

                    var button = this.createButton(this.btMenu)
                    button.onclick = () => {
                        this.doNotInterest()
                    }
                    this.frontMentuContainer.append(button)
                }
            }, () => {
                return this.root.querySelector("ytd-menu-renderer.style-scope.ytd-rich-grid-media") != null
            }, 2000)
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


    waitAndDo(func, checkFunc, timeout, checkInterval = 50) {
        var startTime = new Date().getTime()
        this._innerWaitAndDo(startTime, func, checkFunc, timeout, checkInterval)
    }

    doNotInterest() {
        this.btMenu.click()
        setTimeout(() => {
            this.popup_menu_items = document.querySelectorAll("ytd-menu-service-item-renderer")
            if (this.popup_menu_items.length >= 6) {
                this.popup_menu_items[3].click()
            } else if (this.popup_menu_items.length == 1) {
                this.popup_menu_items[0].click()
                console.log(this.popup_menu_items[0])
            }
        }, 10)
    }

    _createSvg() {
        function getNode(n, v) {
            n = document.createElementNS("http://www.w3.org/2000/svg", n);
            for (var p in v)
                n.setAttributeNS(null, p.replace(/[A-Z]/g, function(m, p, o, s) { return "-" + m.toLowerCase(); }), v[p]);
            return n
        }

        var svg = getNode("svg", {viewBox: "0 0 24 24", width: 24, height: 24});
        document.body.insertBefore(svg, document.body.firstChild);


        var g = getNode('g', {class: ''});
        svg.appendChild(g)

        var path1 = getNode("path", {d: 'M0 0h24v24H0z', fill: 'none', class: 'style-scope yt-icon'})
        var path2 = getNode("path", {d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z', 
            class: 'style-scope yt-icon'})
        g.appendChild(path1)
        g.appendChild(path2)
        return svg
    }

    createButton(btMenu) {
        // strange, not work
        // var btNot = btMenu.cloneNode(true)
        // var originSvg = btNot.querySelector("svg")
        // var parent = originSvg.parentElement
        // var svg = this._createSvg()
        // parent.appendChild(svg)

        var button = document.createElement("button");
        button.setAttribute("class", "style-scope yt-icon-button")
        button.style.color = 'red';
        button.appendChild(this._createSvg())

        return button
    }
}

function getDetails() {
    console.log("getDetails called")
    var details = Array.from(document.querySelectorAll("ytd-rich-grid-media div .style-scope.ytd-rich-grid-media"))
    details = details.filter(d => d.id == "details")
    return details
}

var details = getDetails()


var items = details.map(d => new Item(d))
// new Item(details[0])
// var item = items[0]
// var root = item.root
// console.log(root)