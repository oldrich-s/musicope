/// <reference path="../../../_references.ts" />

export function correctPosition() {
  var el = $(".elFocus");
  var rely: number = el.offset()["top"] - $(window).scrollTop() + 0.5 * el.height();
  if (rely > 0.9 * window.innerHeight) {
    var dy = window.innerHeight - 1.5 * el.height() - rely;
    $(window).scrollTop($(window).scrollTop() - dy);
  } else if (rely < 0.2 * window.innerHeight) {
    $(window).scrollTop(el.offset()["top"] - 2 * el.height());
  }
}