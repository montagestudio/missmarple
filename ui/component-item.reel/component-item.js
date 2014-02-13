/**
 * @module ./component-item.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class ComponentItem
 * @extends Component
 */
exports.ComponentItem = Component.specialize(/** @lends ComponentItem# */ {
    constructor: {
        value: function ComponentItem() {
            this.super();
//            this.defineBinding( "depth", { "<-": "node.depth" });
            this.addPathChangeListener("node.expanded", this, "handleStateChange");
            this.addRangeAtPathChangeListener("node.children", this, "handleStateChange");
        }
    },

    _node: {
        value: null
    },

    node: {
        get: function () {
            return this._node;
        },
        set: function (value) {
            this.needsDraw = true;
            this._node = value;
        }
    },

    handleStateChange: {
        value: function() {
            if(this.node) {
                if (this.node.children.length === 0) {
                    this.stateText = "•"
                } else {
                    if (this.node.expanded) {
                        this.stateText = "▼"
                    } else {
                        this.stateText = "▶"
                    }
                }
            }
        }
    },

    toggleDisclosure: {
        value: function() {
            this.node.expanded = !this.node.expanded;
        }
    },


    draw: {
        value: function() {
            this.element.style.paddingLeft = (this._node.depth * 20) + "px";
        }
    },

    stateText: {
        value: "•"
    }




});
