/**
    @module "ui/main.reel"
*/
var Component = require("montage/ui/component").Component,
    Connection = require("q-connection");

/**
    @class module:"ui/main.reel".Main
    @extends module:ui/component.Component
*/
exports.Main = Component.specialize(/** @lends module:"ui/main.reel".Main# */ {
    constructor: {
        value: function() {
            this._connectToExtension();
        }
    },
    
    _connectToExtension: {
        value: function() {
            var self = this,
                port = this._port = chrome.runtime.connect(),
                listener;

            listener = function (message, sender) {
                if (message === "montage-inspector-ready") {
                    console.log("devtools: montage-inspector-ready");
                    chrome.runtime.onMessage.removeListener(listener);
                    self.connectToMontageInspector(self._port);
                }
            };
            // TODO: don't use messages, use the channel we already have
            chrome.runtime.onMessage.addListener(listener);
            port.postMessage(["inspect-montage", chrome.devtools.inspectedWindow.tabId]);
        }
    },

    connectToMontageInspector: {
        value: function(channel) {
            this.montageInspector = Connection(channel);
        }
    }
});


