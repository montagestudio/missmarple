if(!chrome.devtools) {
    chrome.devtools = {
        inspectedWindow:window,
        panels: {
            create: function() {}
        }
    }
}
(function(){
    var DEBUG = true;
    var Inspector = {};

    Inspector.log = function(message) {
        chrome.devtools.inspectedWindow.eval("console.log('[missmarple] " + message + "');");
    };

    Inspector.debug = function(message) {
        if (DEBUG) {
            this.log.apply(this, arguments);
        }
    };

    Inspector.debug("LOADED " + (new Date()));

    Inspector.run = function(funktion, callback) {
        chrome.devtools.inspectedWindow.eval("("+funktion.toString()+")()", callback);
    };

    chrome.devtools.panels.create(
        "Montage",
        "assets/images/montage-logo-gradients.svg",
        "builds/missmarple/index.html",
        function (panel) {
            Inspector.debug("LOADED panel: " + panel);
        }
    );
})();
