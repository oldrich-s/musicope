module Musicope.Game.KeyboardFns.Overlay {

    var displayDescription: JQuery;
    var displayValue: JQuery;
    var oldTimeOut: number;

    function createDomIfNeeded() {
        if (!displayDescription || !displayValue) {
            var container = $("<div style='position:absolute; top:0px; left:0; color:white; font-size:xx-large; text-align:left;' />").appendTo("body");
            displayDescription = $("<span />").appendTo(container);
            displayValue = $("<span style='color:red;' />").appendTo(container);
        }
    }

    export function display(description: string, value: any) {
        if (value) {
            var str;
            if (typeof value == "number") { str = Math.round(1000 * value) / 1000; }
            else { str = value; }

            createDomIfNeeded();
            displayDescription.text(description + ": ");
            displayValue.text(str);
            clearTimeout(oldTimeOut);
            oldTimeOut = setTimeout(() => {
                displayDescription.text("");
                displayValue.text("");
            }, 5000);
        }
    }

} 