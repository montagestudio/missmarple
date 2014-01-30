/*global Window,Document,Element,Event,Components,Touch,__require,__selectedElement,__global */
var inspected = require("../../core/chrome").inspected;

function rootComponent() {
    return inspected.eval(function() {
        var rootComponent = __require("montage/ui/component").__root__;
        function visit(node, visitor) {
            var newNode;
            if (visitor) {
                newNode = visitor(node);
            }
            var children = node.childComponents;
            if(children != null && children.length) {
                var i = 0;
                newNode.childComponents = [];
                children.forEach(function(childComponent) {
                    newNode.childComponents[i] = visit(childComponent, visitor);
                    i++;
                });
            }
            return newNode;
        }
        var tree = visit(rootComponent, function (component) {
                    var newComponent = {};
                    newComponent.displayName = component.identifier ? component.identifier : component.constructor.name;
                    return newComponent;
                });
        return tree;
    }).fail(function (failure) {
        if(failure.message === "NoDevtools") {
            return testTree;
        } else {
            throw new Error(failure);
        }
    });
};

exports.rootComponent = rootComponent;

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
