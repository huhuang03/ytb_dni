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
    }
});
