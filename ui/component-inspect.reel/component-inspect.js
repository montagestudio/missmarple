/**
 * @module ui/component-inspect.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

var PROPERTIES = [""];
//element
//needsDraw


/**
 * @class ComponentInspect
 * @extends Component
 */
exports.ComponentInspect = Component.specialize(/** @lends ComponentInspect# */ {
    constructor: {
        value: function ComponentInspect() {
            this.super();
        }
    },

    tabTitleforKey: {
        value: function() {
            return "Component"
        }
    },

    _component: {
        value: null
    },

    component: {
        get: function () {
            return this._component;
        },
        set: function (value) {
            this._component = value;
        }
    },


    _inspectedObject: {
        value: null
    },

    inspectedObject: {
        get: function () {
            return this._inspectedObject;
        },
        set: function (value) {
            var self = this;
            if (value && typeof value.then === "function") {
                value.get("_debug_isComponent")
                .then(function (isComponent) {
                    if(isComponent) {
                        self.component = value;
                    }
                }).fail(function () {
                    console.log()
                })
            }
            this._inspectedObject = value;
        }
    }

});
