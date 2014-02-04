/**
    @module "ui/main.reel"
    @requires montage
    @requires montage/ui/component
*/
var Montage = require("montage").Montage;
var Component = require("montage/ui/component").Component;

if(chrome.devtools) {
    require("../../chrome-devtools-autosave/chrome/devtools");
}
/**
    Description TODO
    @class module:"ui/main.reel".Main
    @extends module:ui/component.Component
*/
exports.Main = Montage.create(Component, /** @lends module:"ui/main.reel".Main# */ {

    inspectedPageRefresh: {
        value: function() {
            var port = chrome.extension.connect();
            port.postMessage({
                action: 'register',
                inspectedTabId: chrome.devtools.inspectedWindow.tabId
            });
            port.onMessage.addListener(function(msg) {
                if (msg === 'refresh') {
                    cb();
                }
            });
            port.onDisconnect.addListener(function (a) {
                console.log(a);
            });
        }
    }
});


