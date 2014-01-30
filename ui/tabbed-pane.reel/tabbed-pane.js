/**
 * @module ./tabbed-pane.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class TabbedPane
 * @extends Component
 */
exports.TabbedPane = Component.specialize(/** @lends TabbedPane# */ {
    constructor: {
        value: function TabbedPane() {
            this.super();
        }
    },

    enterDocument: {
        value: function(firstTime) {
            var argumentNames;
            var tabTitles = [];
            var i, element, displayName;
            if (firstTime) {
                argumentNames = this.getDomArgumentNames();
                for (i = 0, name; (name = argumentNames[i]); i++) {
                    element = this.extractDomArgument(name);
                    if(element.component && typeof element.component.tabTitleforKey === "function") {
                        displayName = element.component.tabTitleforKey(name);
                    } else if(this.delegate && typeof this.delegate.tabTitleforKey === "function") {
                        displayName = this.delegate.tabTitleforKey(name);
                    } else {
                        displayName = name;
                    }
                    tabTitles.push({displayName: displayName, key: name});
                    this._content.addSwitchElement(name,element);
                }
                if(tabTitles.length > 0) {
                    this._tabsController.content = tabTitles;
                    this._tabsController.avoidsEmptySelection = true;
                    this._tabsController.select(tabTitles[0])
                }
            }
        }
    }
});
