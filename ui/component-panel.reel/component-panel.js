/**
 * @module ./component-panel.reel
 * @requires montage/ui/component
 */
var Montage = require("montage").Montage;
var Component = require("montage/ui/component").Component;
var rootComponent = require("../../core/component-tree").rootComponent;
var Promise = require("montage/core/promise").Promise;

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

            var self = this;

            rootComponent().then(function (remote) {
                return new LocalComponent().adopt(remote);
            })
            .then(function (root) {
                self.root = root;
            }).done();


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


var LocalComponent = Montage.specialize({
    constructor: {
        value: function LocalComponent() {

        }
    },

    adopt: {
        value: function(remote) {
            this._remote = remote;

            return Promise.all([
                this.getRemoteValue("displayName"),
                this._getChildComponents()
            ])
            .thenResolve(this);
        }
    },

    adoptAll: {
        value: function(remoteComponents) {
            var promisesOfAdoption = [];
            var i = 0,
            componentsLength = remoteComponents.length;
            for (i; i < componentsLength; i++) {
                var remoteComponent = remoteComponents[i];
                var localComponent = new LocalComponent();
                promisesOfAdoption.push(localComponent.adopt(remoteComponent))
            }
            return Promise.all(promisesOfAdoption);
        }
    },

    _getChildComponents: {
        value: function() {

            var self = this;
            return this._remote
            .get("childComponents")
            .then(function (childComponents) {
                return self.adoptAll(childComponents)
            })
            .then(function (localComponents) {
                return self.childComponents = localComponents;
            });
        }
    },

    _listenToChildComponentsChanges: {
        value: function() {

            var self = this;
            return this._remote
            .get("childComponents")
            .then(function (childComponents) {
                return self.adoptAll(childComponents)
            })
            .then(function (localComponents) {
                return self.childComponents = localComponents;
            });
        }
    },

    getRemoteValue: {
        value: function(propertyName) {
            var self = this;
            return this._remote
                .get("_debug_" + propertyName)
                .then(function (value) {
                    return self[propertyName] =  value;
                });
        }
    }

});
