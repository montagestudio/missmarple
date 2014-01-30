/**
 * Created by francois on 1/22/14.
 */

// notify of page refreshes
chrome.extension.onConnect.addListener(function(port) {
    port.onMessage.addListener(function (message) {
        if (message.action === "register") {
            var listener = function (tabId, changeInfo, tab) {
                if (tabId !== message.inspectedTabId) {
                    return;
                }
                port.postMessage("refresh");
            };

            chrome.tabs.onUpdated.addListener(listener);
            port.onDisconnect.addListener(function () {
                chrome.tabs.onUpdated.removeListener(listener);
            });
        }
    });
});

// Populate the routes for chrome-devtools-autosave

localStorage.routes = JSON.stringify([{
    id: '0',
    match: '^http://localhost:8081/',
    savePath: '/Users/francois/declarativ/'
}]);
localStorage.servers = JSON.stringify([{
    id: '0',
    url: 'http://127.0.0.1:9104'
}]);
