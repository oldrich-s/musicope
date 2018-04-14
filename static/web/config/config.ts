import * as $ from 'jquery'

import { defaultConfig } from "./default-config"
import { IConfig } from "./i-config"

export const config = $.extend(true, {}, defaultConfig)

const subscriptions: { [key: string]: { regex: RegExp, callback: (param: string, value: any) => void } } = {}

function call(param: string, value: any) {
    for (const prop in subscriptions) {
        const s = subscriptions[prop]
        if (param.search(s["regex"]) > -1) {
            s["callback"](param, value)
        }
    }
}

export function reset() {
    for (const key in subscriptions) {
        delete subscriptions[key]
    }
}

export function subscribe(id: string, regex: string, callback: (param: string, value: any) => void) {
    subscriptions[id] = {
        regex: new RegExp(regex),
        callback: callback
    }
}

export function setParam(name: string, value: any, dontNotifyOthers?: boolean) {
    (config as any)[name] = value
    if (!dontNotifyOthers) {
        call(name, value)
    }
}

export function areEqual(param1: any, param2: any) {
    if ("every" in param1 && "every" in param2) {
        const areEqual = (<any[]>param1).every((param1i, i) => {
            return param1i == param2[i]
        })
        return areEqual
    } else {
        return param1 == param2
    }
}