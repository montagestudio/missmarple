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

//var DEBUG = true;
//var Inspector = {};

//Inspector.log = function(message) {
//    chrome.devtools.inspectedWindow.eval("console.log('[missmarple] " + message + "');");
//};
//
//Inspector.debug = function(message) {
//    if (DEBUG) {
//        this.log.apply(this, arguments);
//    }
//};
//
//Inspector.debug("LOADED " + (new Date()));

//Inspector.run = function(funktion, callback) {
//    chrome.devtools.inspectedWindow.eval("("+funktion.toString()+")()", callback);
//};

//(function getRootComponent() {
//    Inspector.run(function() {
//        require.async("montage/ui/component");
//    }, function() {
//        Inspector.run(function() {
//            return require("montage/ui/component").__root__;
//        }, function(component) {
//            if (component == null) {
//                Inspector.log("WARNING: root component NOT found!");
//            } else {
//                Inspector.debug("root component found!");
//            }
//        });
//    });
//})();

//chrome.devtools.panels.create(
//    "Montage",
//    "assets/images/montage-logo-gradients.svg",
//    "missmarple.html"
//);

//chrome.devtools.panels.elements.createSidebarPane(
//    "Montage",
//    function (sidebar) {
//        sidebar.setPage("missmarple.html");
//    }
//);
