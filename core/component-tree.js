/*global Window,Document,Element,Event,Components,Touch,__require,__selectedElement,__global */
var Montage = require("montage").Montage;
var devtoolsController = require("./devtools-controller");
var LocalComponent = require("./local-component").LocalComponent;
var pageConnection = devtoolsController.pageConnection;

var ComponentTree = Montage.specialize({
    constructor: {
        value: function ComponentTree() {
        }
    },

    loadTree: {
        value: function() {

            var self = this;

            return pageConnection
            .then(function (pageConnection) {
                return pageConnection.get("rootComponent");
            }).then(function (remote) {
                return new LocalComponent().adopt(remote);
            })
            .then(function (root) {
                return self.root = root;
            });
        }
    },

    root: {
        value: null
    }
});

exports.componentTree = new ComponentTree();

var testTree = {"displayName": "RootComponent", "childComponents": [
    {"displayName": "Main", "childComponents": [
        {"displayName": "facadeflow", "childComponents": [
            {"displayName": "flow", "childComponents": [
                {"displayName": "repetition", "childComponents": [
                    {"displayName": "image"},
                    {"displayName": "image"},
                    {"displayName": "image"},
                    {"displayName": "image"},
                    {"displayName": "image"}
                ]},
                {"displayName": "slot"}
            ]},
            {"displayName": "details", "childComponents": [
                {"displayName": "title"},
                {"displayName": "dates"},
                {"displayName": "runtime"},
                {"displayName": "rentButton"},
                {"displayName": "trailerButton"},
                {"displayName": "audienceScore"},
                {"displayName": "criticsScore"},
                {"displayName": "scroller", "childComponents": [
                    {"displayName": "scrollbars"},
                    {"displayName": "description"}
                ]}
            ]}
        ]},
        {"displayName": "categoryButton"},
        {"displayName": "categoryButton"},
        {"displayName": "categoryButton"},
        {"displayName": "categoryButton"},
        {"displayName": "popup", "childComponents": [
            {"displayName": "closeButton"}
        ]}
    ]}
]};
