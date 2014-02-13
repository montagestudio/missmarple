/**
 * @module ui/string-promise.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class StringPromise
 * @extends Component
 */
exports.StringPromise = Component.specialize(/** @lends StringPromise# */ {
    constructor: {
        value: function StringPromise() {
            this.super();
            this.addPathChangeListener("promise", this, "handleChange");
            this.addPathChangeListener("property", this, "handleChange");
        }
    },

    handleChange: {
        value: function() {
            var self = this;
            if (this.promise && this.property && this.property.length > 0) {

                this.promise
                .invoke("addPathChangeListener", this.property, function (value) {
                    self._value = ""+value;
                })
                .done();
//                this.promise
//                .get(this.property)
//                .then(function (value) {
//                    self._value = ""+value;
//                })
//                .done();
            }
        }
    },


    promise: {
        value: null
    },

    property: {
        value: null
    },

    _value: {
        value: null
    }
});
