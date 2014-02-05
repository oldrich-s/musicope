module Musicope.LocStorage {

  export function get(name: string, defaultValue: any) {
    var val = localStorage.getItem(name);
    if (!val || val === "undefined") {
      return defaultValue;
    } else {
      try {
        return JSON.parse(val);
      } catch (e) {
        return val;
      }

    }
  }

  export function set(name: string, value: any) {
    var val = JSON.stringify(value);
    localStorage.setItem(name, val);
  }

}