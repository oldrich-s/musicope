module Musicope.Game.Inputs.KeyboardFns.Actions.List {

    export class displayHelp implements IKeyboardAction {

        id = "display help";
        description = "displays a help window";
        key = "enter";

        private window: JQuery;
        private isDisplayed = false;

        constructor(private p: IKeyboardParams) {
            var o = this;
            $.get("Content/overlay.html?1").done((result) => {
                $(result).appendTo("body");
                o.window = $("#displayHelpOverlay");
            });

        }

        triggerAction() {
            var o = this;
            o.isDisplayed = !o.isDisplayed;
            o.p.params.setParam("p_isPaused", o.isDisplayed);
            o.display();
        }

        getCurrentState() {
            var o = this;
            return o.isDisplayed;
        }

        private display() {
            var o = this;
            if (o.isDisplayed) {
                o.p.actions.done((actions: IKeyboardAction[]) => {
                    o.p.params.subscribe("displayHelp", ".*",(name, value) => {
                        o.refillTable(actions);
                    });
                    o.refillTable(actions);
                    o.window.css("display", "block");
                });
            } else {
                o.p.params.unsubscribe("displayHelp");
                o.window.css("display", "none");
            }
        }

        private refillTable(actions: IKeyboardAction[]) {
            var o = this;
            var table = o.window.children("table");
            table.find("tr:has(td)").html("");
            var sortedActions = actions.sort((a, b) => {
                return <any>(a.id > b.id);
            });
            sortedActions.forEach((action) => {
                var row = $("<tr/>").appendTo(table);
                var idCell = $("<td class='idCell'/>").appendTo(row);
                var keyCell = $("<td class='keyCell'/>").appendTo(row);
                var descriptionCell = $("<td class='descriptionCell'/>").appendTo(row);
                var currentCell = $("<td class='currentCell'/>").appendTo(row);
                idCell.text(action.id);
                keyCell.text("" + action.key);
                descriptionCell.text(action.description);
                currentCell.text(o.tryRoundValue(action.getCurrentState()));
            });
        }

        private tryRoundValue(value: any) {
            if (typeof value == "number") { return Math.round(100 * value) / 100; }
            else { return value; }
        }

    }

} 