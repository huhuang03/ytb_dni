console.log("hello from background")

chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    // console.log("onHistoryStateUpdated called")
    // ok, let do something.
    const url = details.url
    if (url === 'https://www.youtube.com' || url === 'https://www.youtube.com/') {
        setTimeout(() => {
            chrome.scripting.executeScript(
                {
                    target: {tabId: details.tabId},
                    files: ["add_not_interested.js"]
                }
            ).catch(err => {
                console.error(err)
            });
        }, 2500)
        // console.log(details)
        // // console.log(chrome.tabs)
        // // 目前没有什么办法，先延时吧
        // Promise.delay(3000).then(() => {
        // })
    }
});
