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
//            this.refresh();
        }
    },

    tabTitleforKey: {
        value: function() {
            return "Components"
        }
    },

    refresh: {
        value: function() {

            rootComponent().then(function (component) {
                component.addRangeAtPathChangeListener.fcall(null,"childComponents", function (plus, minus, index) {
                    debugger
                }).done();
                return Q.thenResolve(component);
            })
            .then(function (component) {
                component.invoke("load");
            }).done()


//            var self = this;
//            rootComponent.then(function (rootComponent) {
//                return rootComponent.get("componentTree");
//            }).then(function (componentTree) {
//                self.root = componentTree;
//            }).done();
        }
    },


    root: {
        value: null
    }
});
