/// <reference path="../../../_references.ts" />

var displayDescription: IJQuery.JQuery;
var displayValue: IJQuery.JQuery;
var oldTimeOut: number;

function createDomIfNeeded() {
  if (!displayDescription || !displayValue) {
    var container = $("<div />").appendTo('#overlayDiv');
    displayDescription = $("<span />").appendTo(container);
    displayValue = $("<span style='color:red;font-size:large;' />").appendTo(container);
  }
}

export function display(description: string, value: any) {
  createDomIfNeeded();
  displayDescription.text(description + ": ");
  displayValue.text(value);
  clearTimeout(oldTimeOut);
  oldTimeOut = setTimeout(() => {
    displayDescription.text("");
    displayValue.text("");
  }, 5000);
}


