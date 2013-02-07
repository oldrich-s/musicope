/// <reference path="../_lib/purl/purl.d.ts" />

export function getUrlParams(_default): any {
  var params = $.url().param();
  var out = {};
  for (var name in _default) {
    if (name in params) {
      try {
        out[name] = JSON.parse(params[name]);
      } catch (e) {
        out[name] = params[name];
      }
    } else {
      out[name] = _default[name];
    }
  }
  return out;
}