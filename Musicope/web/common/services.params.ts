/// <reference path="../_lib/purl/purl.d.ts" />

export function getUrlParams(): any {
  var params = $.url().param();
  var out = {};
  for (var name in params) {
    if (name in params) {
      try{ out[name] = JSON.parse(params[name]); } catch (e) { out[name] = params[name]; }
    }
  }
  return out;
}

export function copy(from, _default) {
  var out: any = {};
  for (var name in _default) {
    out[name] = name in from ? from[name] : _default[name]; 
  }
  return out;
}
