var Montage = require("montage").Montage;
var Promise = require("montage/core/promise").Promise;

var LocalComponent = exports.LocalComponent = Montage.specialize({
    constructor: {
        value: function LocalComponent() {
            this.childComponents = [];
        }
    },

    adopt: {
        value: function(remote) {
            this._remote = remote;

            return Promise.all([
                this.getRemoteValue("displayName"),
                this._listenToChildComponentsChanges()
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

    _listenToChildComponentsChanges: {
        value: function() {
            var self = this;
            return this._remote
            .invoke("addRangeAtPathChangeListener", "childComponents", function (plus, minus, index) {
                self.adoptAll(plus)
                .then(function (plusComponents) {
                    self.childComponents.swap(index, minus.length, plusComponents);
                })
                .done();
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
