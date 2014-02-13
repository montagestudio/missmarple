/**
 * @module ./component-panel.reel
 * @requires montage/ui/component
 */
var Montage = require("montage").Montage;
var Component = require("montage/ui/component").Component;
var componentTree = require("../../core/component-tree").componentTree;

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
            componentTree.loadTree()
            .then(function (root) {
                return self.root = root;
            })
            .done();
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


