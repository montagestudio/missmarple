
// Negotiate a connection between the content script and the browser page if
// possible.  Since the content script and page may be executed in any order
// relative to each other, the hand-shake must be order independent.  To
// facilitate this, either actor can initiate the handshake.
//
// If the content script loads first, it will wait for the browser page to send
// a "can-show-promises" challenge.  It will then send a "can-watch-promises"
// response.
//
// If the page loads first, the "can-show-promises" challenge will go ignored.
// The content script will send a "can-watch-promises" challenge.
//
// Either way, the page will receive a "can-watch-promises" message indicating
// that both the content script and browser page are ready to communicate.
// At that point, the page will send a "promise-channel" message with a message port
// to establish two way communication.  The content script will serve as a
// two-way message proxy between the page and the debugger.
//
// The content script for the Ember Inspector greatly informed this design,
// except that I have elected to use this message passing handshake instead of
// signaling and poling the DOM.
//
// https://github.com/tildeio/ember-extension/blob/b70735d72563dc0dc2e3b310e58efa226de68756/extension_dist/content-script.js

// XXX there is a chance that this will interfere with an existing message
// protocol

// content executed before montage
// 1. #ignored         <= content-connect
// 2. montage-ready =>
// 3.                  <= content-connect
// 4. montage-connect  =>

// montage executed before content
// 1. montage-ready => #ignored
// 2.                  <= content-connect
// 4. montage-connect  =>

window.addEventListener("message", function (event) {
    var message = event.data;
    var action = message.action;

    if (!action)
        return;
    if (action === "montage-connect") {
        //console.log('content: receive "' + type + '"');
        connect(event.ports[0]);
    } else if (action === "montage-ready") {
        //console.log('content: receive "' + type + '"');
        window.postMessage({"action": "content-connect"}, window.location.origin);
    }
});

//console.log('content: send "can-inspect-montage"');
window.postMessage({"action": "content-connect"}, window.location.origin);

var montagePort;
var backgroundPort;

//Connect to the background

function connect(port) {
    montagePort = port;
    backgroundPort = chrome.runtime.connect({name: "content-background"});

    // Montage page -> content -> background
    montagePort.addEventListener("message", function (event) {
        console.log("=> Forward message to background. ", event.data);
        backgroundPort.postMessage(event.data);
    });
    // background -> content -> Montage page
    backgroundPort.onMessage.addListener( function(message, sender, sendResponse) {
        console.log("<= Forward message to Montage. ", message);
        montagePort.postMessage(message);
    });

    montagePort.start();
    console.log("montage <=> content - Connected");
}




///    ConnectionController.prototype.componentTree = function (component) {
//        debugger
//        var rootComponent = require("montage/ui/component").__root__;
//        function visit(node, visitor) {
//            var newNode;
//            if (visitor) {
//                newNode = visitor(node);
//            }
//            var children = node.childComponents;
//            if(children != null && children.length) {
//                var i = 0;
//                newNode.childComponents = [];
//                children.forEach(function(childComponent) {
//                    newNode.childComponents[i] = visit(childComponent, visitor);
//                    i++;
//                });
//            }
//            return newNode;
//        }
//        var tree = visit(rootComponent, function (component) {
//                    var newComponent = {};
//                    newComponent.displayName = component.identifier ? component.identifier : component.constructor.name;
//                    return newComponent;
//                });
//        return tree;
//    };
