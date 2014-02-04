/*global chrome*/

var ports = {};
var tabs = {};

// TODO: explain how it works

// For messages coming from content scripts
chrome.runtime.onMessage.addListener(function (message, sender) {
    console.log("background", message, sender);
    if (message === "montage-inspector-ready") {
        tabs[sender.tab.id] = message;
        // If devtools has already connected then inform it that the window is
        // ready to be inspected.
        if (sender.tab.id in ports) {
            connect(sender.tab.id);
            ports[sender.tab.id].postMessage(message);
        }
        // Remove listener
    }
});

// For messages coming from content scripts
//chrome.runtime.onMessage.addListener(function (message, sender) {
//    var id = sender.tab.id;
//    var port = ports[id];
//    if (port) {
//        port.postMessage(message);
//    } else {
//        messages[id] = messages[id] || [];
//        messages[id].push(message);
//    }
//});

// For connections coming from the web inspector
chrome.runtime.onConnect.addListener(function (port) {
    var id;

    port.onMessage.addListener(function (message) {
        // for the handshake message
        if (message[0] === "inspect-montage") {
            id = message[1]; // for us
            ports[id] = port; // for others
            if (id in tabs) {
                connect(id);
                port.postMessage("montage-inspector-ready");
            }
        } else {
            // XXX there is a chance we'll need to
            // filter messages
            tabs[id].postMessage(message);
        }
    });
});

function connect(id) {
    var extensionPort = tabs[id] = chrome.tabs.connect(id),
        montagePort = ports[id];

    extensionPort.onMessage.addListener(function(message) {
        montagePort.postMessage(message);
    });
}
