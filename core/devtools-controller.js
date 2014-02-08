var Promise = require("montage/core/promise").Promise;
var Connection = require("q-connection");
var Q = require("q");

var pageConnection = Q.defer();
var devtoolProxy = {};

var connected = false;

if(chrome.runtime) {
    //Connect to the background
    var backgroundPort = chrome.runtime.connect({name: "background-devtools"});
    // content -> background -> devtools
    var messageListener = function(message, sender, sendResponse) {
        console.log("content -> background -> devtools message:", message);
        if(message.action === "background-ready") {
            backgroundPort.postMessage({"action": "inspect-montage"});
            console.log("background <=> devtools - Connected");
            // when the page reloads
            if(!connected) {
                pageConnection.resolve(Connection(backgroundPort, devtoolProxy));
                connected = true;
            }
        }
    };
    //keep listenting so that
    backgroundPort.onMessage.addListener(messageListener);
}

exports.pageConnection = pageConnection.promise;
exports.devtoolProxy = devtoolProxy;
