module Musicope.Params {

    var subscriptions = {};

    function call(param: string, value: any) {
        for (var prop in subscriptions) {
            var s = subscriptions[prop];
            if (param.search(s["regex"]) > -1) {
                s["callback"](param, value);
            }
        }
    }

    export function reset() {
        subscriptions = {};
        params = jQuery.extend(true, {}, defaultParams);
    }

    export function subscribe(id: string, regex: string, callback: (param: string, value: any) => void) {
        subscriptions[id] = {
            regex: new RegExp(regex),
            callback: callback
        };
    }

    export function unsubscribe(id: string) {
        delete subscriptions[id];
    }

    export function setParam(name: string, value: any, dontNotifyOthers?: boolean) {
        params[name] = value;
        if (!dontNotifyOthers) {
            call(name, value);
        }
    }

    export function areEqual(param1: any, param2: any) {
        if ("every" in param1 && "every" in param2) {
            var areEqual = (<any[]> param1).every((param1i, i) => {
                return param1i == param2[i];
            });
            return areEqual;
        } else {
            return param1 == param2;
        }
    }   

}