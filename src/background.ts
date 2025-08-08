import { browserApi, isChrome } from './util/brower_api'

if (isChrome) {
  browserApi.webNavigation.onHistoryStateUpdated.addListener(function(details: any) {
    // ok, let do something.
    const url = details.url
    if (url === 'https://www.youtube.com' || url === 'https://www.youtube.com/') {
      setTimeout(() => {
        browserApi.scripting.executeScript(
            {
              target: {tabId: details.tabId},
              files: ["add_not_interested.js"]
            }
        ).catch((err: any) => {
          console.error(err)
        });
      }, 2500)
    }
  });
}

