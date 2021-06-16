console.log("hello from background")

chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    // console.log("onHistoryStateUpdated called")
    // chrome.tabs.executeScript(null,{file:"contentscript.js"});
    // ok, let do something.
    console.log(details)
    console.log(chrome.tabs)
});
