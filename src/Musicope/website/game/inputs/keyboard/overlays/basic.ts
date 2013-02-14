/// <reference path="../../../_references.ts" />

var displayDescription: IJQuery.JQuery;
var displayValue: IJQuery.JQuery;
var oldTimeOut: number;

function createDomIfNeeded() {
  if (!displayDescription || !displayValue) {
    var container = $("<div style='position:absolute; top:0; left:0; color:white; font-size:xx-large;' />").appendTo("body");
    displayDescription = $("<span />").appendTo(container);
    displayValue = $("<span style='color:red;' />").appendTo(container);
  }
}

export function display(description: string, value: any) {

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


