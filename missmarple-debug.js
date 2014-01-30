if (chrome.devtools) {
    var DEBUG = true;
    var Inspector = {};

    Inspector.log = function(message) {
//        chrome.devtools.inspectedWindow.eval("console.log('[missmarple page] " + message + "');");
    };

    Inspector.debug = function(message) {
        if (DEBUG) {
            this.log.apply(this, arguments);
        }
    };

    Inspector.debug("LOADED " + (new Date()));

    Inspector.run = function(funktion, callback) {
//        chrome.devtools.inspectedWindow.eval("("+funktion.toString()+")()", callback);
    };

    console.error = Inspector.log
    console.log = Inspector.log
    console.debug = Inspector.log

}
