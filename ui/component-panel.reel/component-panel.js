/**
 * @module ./component-panel.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;
var rootComponent = require("../../core/component-tree").rootComponent;

/**
 * @class ComponentPanel
 * @extends Component
 */
exports.ComponentPanel = Component.specialize(/** @lends ComponentPanel# */ {
    constructor: {
        value: function ComponentPanel() {
            this.super();
        }
    },

    enterDocument: {
        value: function () {
            var self = this;
            rootComponent().then(function (rootComponent) {
                self.root = rootComponent;
            }).done();
        }
    },
    
    tabTitleforKey: {
        value: function() {
            return "Components"
        }
    },
    

    root: {
        value: null
    }
});
