import * as $ from 'jquery'

import { writeTextFile, readTextFile, setupJsonPath } from "../io/io"
import { defaultConfig, set as setDefaultConfig } from "../config/default-config"

function getValue(el: JQuery) {
    if (el.attr('type') == 'checkbox') {
        return (<any>el[0]).checked
    } else {
        const v = el.val() as string
        const fl = parseFloat(v)
        return fl === NaN ? v : fl
    }
}

function setValue(el: JQuery, value: any) {
    if (el.attr('type') == 'checkbox') {
        (<any>el[0]).checked = value
    } else {
        el.val(value)
    }
}

function onDOMChange() {
    $('.setupPage input').change(function (e) {
        const el = $(this)
        const id = el.attr('id')
        if (id) {
            if (id in defaultConfig) {
                defaultConfig[id] = getValue(el)
                writeTextFile(setupJsonPath, JSON.stringify(defaultConfig, null, 4))
            } else {
                const m = id.match(/^(.+)_(\d)$/)
                if (m && m.length == 3) {
                    if (m[1] in defaultConfig) {
                        defaultConfig[m[1]][parseInt(m[2])] = getValue(el)
                        writeTextFile(setupJsonPath, JSON.stringify(defaultConfig, null, 4))
                    }
                }
            }
        }
    })
}

function setConfigDOM() {
    for (const key in defaultConfig) {
        if (typeof defaultConfig[key] == "object") {
            defaultConfig[key].forEach((v: any, i: any) => {
                const el = $('#' + key + '_' + i)
                if (el.length == 1) {
                    setValue(el, v)
                }
            })
        } else {
            const el = $('#' + key)
            if (el.length == 1) {
                setValue(el, defaultConfig[key])
            }
        }
    }
}

async function readConfig() {
    setDefaultConfig(defaultConfig)
}

export function init() {
    readConfig()
    setConfigDOM()
    onDOMChange()
}
