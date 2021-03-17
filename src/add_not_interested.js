console.log("add_not_interested.js called")
// how to do ??

class Item {
    constructor(root) {
        this.root = root
        this.init()
    }

    init() {
        this.front_menu_container = root.querySelectorAll("ytd-menu-renderer.style-scope.ytd-rich-grid-media")
    }

    parse() {
    }
}


// ytd-rich-grid-media:not(:hover) ytd-menu-renderer.ytd-rich-grid-media:not([menu-active]).ytd-rich-grid-media:not(:focus-within) {
//    /* opacity: 0; */
// }
function getMenuItems() {
    items = document.querySelectorAll("ytd-menu-renderer.style-scope.ytd-rich-grid-media")
    return items
}

items = getMenuItems()
console.log(items)
item = items[0]
item1 = items[1]
item4 = items[4]
menu = item

function handleSingleMenu(menu) {
    childNodes = menu.childNodes;
    bt_child = menu.querySelector("yt-icon-button")
    // bt_child_clone = bt_child.cloneNode(true)

    var btn = document.createElement("BUTTON");   // Create a <button> element
    btn.innerHTML = "CLICK ME";                   // Insert text
    document.body.appendChild(btn);               // Append <button> to <body

    menu.appendChild(btn)
}

// how to add the button click??