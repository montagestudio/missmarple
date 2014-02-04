var Q = require("q");

var activeContentPort;
var activeDevtoolsPort;

function connect() {
    var contentPortDeferred;
    var devtoolsPortDeferred;

    if (activeContentPort && activeDevtoolsPort) {
    } else if (activeContentPort) {
        contentPortDeferred = Q.master(activeContentPort);
        devtoolsPortDeferred = Q.defer();
    } else if (activeDevtoolsPort) {
        contentPortDeferred = Q.defer();
        devtoolsPortDeferred = Q.master(activeDevtoolsPort);
    } else {
        contentPortDeferred = Q.defer();
        devtoolsPortDeferred = Q.defer();
    }

    var connectionListener = function(port) {
        if (port.name === "content-background") {
            contentPortDeferred.resolve(port);
        } else if (port.name === "background-devtools") {
            devtoolsPortDeferred.resolve(port);
        }
    }
    chrome.runtime.onConnect.addListener(connectionListener);

    return Q.all([
            contentPortDeferred.then ? contentPortDeferred : contentPortDeferred.promise,
            devtoolsPortDeferred.then ? devtoolsPortDeferred : devtoolsPortDeferred.promise
        ]).spread(function (contentPort, devtoolsPort) {

        chrome.runtime.onConnect.removeListener(connectionListener);

        console.log("<--> ports ready. ");

        if (!activeContentPort) {
            var contentPortListener = function(message, sender, sendResponse) {
                if(activeDevtoolsPort) {
                    console.log("=> Forward message to devtools. ", message);
                    activeDevtoolsPort.postMessage(message);
                } else {
                    console.log("=> ERROR devtools is disconnected. ", message);
                }
            }
            activeContentPort = contentPort;
            activeContentPort.onMessage.addListener(contentPortListener);
         }

        if (!activeDevtoolsPort) {
            var devtoolsPortListener = function(message, sender, sendResponse) {
                if(activeContentPort) {
                    console.log("<= Forward message to content. ", message);
                    activeContentPort.postMessage(message);
                } else {
                    console.log("<= ERROR content is disconnected. ", message);
                }
            }
            activeDevtoolsPort = devtoolsPort;
            activeDevtoolsPort.onMessage.addListener(devtoolsPortListener);
        }

        activeContentPort.postMessage({action: "background-ready"});
        activeDevtoolsPort.postMessage({action: "background-ready"});

        var disconnectContent = function(port) {
            console.log(">--< content port disconnected. ");
            contentPort.onDisconnect.removeListener(disconnectContent);
            contentPort.onMessage.removeListener(contentPortListener);
            activeContentPort = null;
            // reconnect when possible
            connect().done();
        }
        contentPort.onDisconnect.addListener(disconnectContent);

        var disconnectDevtools = function(port) {
            console.log(">--< devtools port disconnected. ");
            devtoolsPort.onDisconnect.removeListener(disconnectDevtools);
            devtoolsPort.onMessage.removeListener(devtoolsPortListener);
            activeDevtoolsPort = null;
            // reconnect when possible
            connect().done();
        }
        devtoolsPort.onDisconnect.addListener(disconnectDevtools);
    });
}
connect().done();

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
