/**
 * Created by francois on 1/22/14.
 */
var Montage = require("montage").Montage;
var Promise = require("montage/core/promise").Promise;

var InspectedWindow = Montage.specialize({

    eval: {
        value: function (funk) {
            var deferred = Promise.defer();
//            var options = {
//                frameURL
//                contextSecurityOrigin
//                useContentScriptContext
//            }
            var functionString = "(function(__global, __require, __selectedElement){return (" +funk.toString();
            if (arguments.length > 1) {
                functionString += ".apply(__global, " + JSON.stringify(Array.prototype.slice.call(arguments,1)) + ")}(window, require, $0));";
            } else {
                functionString += ").apply(__global)})(window, require, $0);";
            }
            if(!chrome.devtools) {
                deferred.reject(new Error("NoDevtools"));
            } else {
                chrome.devtools.inspectedWindow.eval(functionString, function (result, isException) {
                   if (isException) {
                       deferred.reject(result);
                   } else {
                       deferred.resolve(result);
                   }
               });
             }
            return deferred.promise;
        }
    }


});

exports.inspected = new InspectedWindow();
