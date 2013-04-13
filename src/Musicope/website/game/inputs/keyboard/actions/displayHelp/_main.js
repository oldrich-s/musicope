define(["require", "exports", "../../../../../common/keyCodes"], function(require, exports, __keysM__) {
    /// <reference path="../../../_references.ts" />
    var keysM = __keysM__;

    var displayHelp = (function () {
        function displayHelp(p) {
            this.p = p;
            this.id = "display help";
            this.description = "displays a help window";
            this.key = keysM.enter;
            this.isDisplayed = false;
            var o = this;
            $.get("inputs/keyboard/actions/displayHelp/_assets/overlay.html?1").done(function (result) {
                $(result).appendTo("body");
                o.window = $("#displayHelpOverlay");
            });
        }
        displayHelp.prototype.triggerAction = function () {
            var o = this;
            o.isDisplayed = !o.isDisplayed;
            o.p.params.setParam("p_isPaused", o.isDisplayed);
            o.display();
        };
        displayHelp.prototype.getCurrentState = function () {
            var o = this;
            return o.isDisplayed;
        };
        displayHelp.prototype.display = function () {
            var o = this;
            if(o.isDisplayed) {
                o.p.actions.done(function (actions) {
                    o.p.params.subscribe("displayHelp", ".*", function (name, value) {
                        o.refillTable(actions);
                    });
                    o.refillTable(actions);
                    o.window.css("display", "block");
                });
            } else {
                o.p.params.unsubscribe("displayHelp");
                o.window.css("display", "none");
            }
        };
        displayHelp.prototype.refillTable = function (actions) {
            var o = this;
            var table = o.window.children("table");
            table.find("tr:has(td)").html("");
            var sortedActions = actions.sort(function (a, b) {
                return a.id > b.id;
            });
            sortedActions.forEach(function (action) {
                var row = $("<tr/>").appendTo(table);
                var idCell = $("<td class='idCell'/>").appendTo(row);
                var keyCell = $("<td class='keyCell'/>").appendTo(row);
                var descriptionCell = $("<td class='descriptionCell'/>").appendTo(row);
                var currentCell = $("<td class='currentCell'/>").appendTo(row);
                idCell.text(action.id);
                keyCell.text("" + o.keyCodeToName(action.key));
                descriptionCell.text(action.description);
                currentCell.text(o.tryRoundValue(action.getCurrentState()));
            });
        };
        displayHelp.prototype.keyCodeToName = function (keyCode) {
            for(var prop in keysM) {
                if(keysM[prop] === keyCode) {
                    return prop;
                }
            }
        };
        displayHelp.prototype.tryRoundValue = function (value) {
            if(typeof value == "number") {
                return Math.round(100 * value) / 100;
            } else {
                return value;
            }
        };
        return displayHelp;
    })();
    exports.displayHelp = displayHelp;    
})
//@ sourceMappingURL=_main.js.map
