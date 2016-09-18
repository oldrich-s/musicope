module Musicope.Setup {

    function getValue(el: JQuery) {
        if (el.attr('type') == 'checkbox') {
            return (<any>el[0]).checked;
        } else {
            var v = el.val();
            var fl = parseFloat(v);
            return fl === NaN ? v : fl;
        }
    }

    function setValue(el: JQuery, value: any) {
        if (el.attr('type') == 'checkbox') {
            (<any>el[0]).checked = value;
        } else {
            el.val(value);
        }
    }

    function onDOMChange() {
        $('.setupPage input').change(function (e) {
            var el = $(this);
            if (el.attr('id') in defaultConfig) {
                defaultConfig[el.attr('id')] = getValue(el);
                IO.writeTextFile(setupJsonPath, JSON.stringify(defaultConfig, null, 4));
            } else {
                var m = el.attr('id').match(/^(.+)_(\d)$/);
                if (m.length == 3) {
                    if (m[1] in defaultConfig) {
                        defaultConfig[m[1]][parseInt(m[2])] = getValue(el);
                        IO.writeTextFile(setupJsonPath, JSON.stringify(defaultConfig, null, 4));
                    }
                }
            }
        });
    }

    function setConfigDOM() {
        for (var key in defaultConfig) {
            if (typeof defaultConfig[key] == "object") {
                defaultConfig[key].forEach((v, i) => {
                    var el = $('#' + key + '_' + i);
                    if (el.length == 1) {
                        setValue(el, v);
                    }
                });
            } else {
                var el = $('#' + key);
                if (el.length == 1) {
                    setValue(el, defaultConfig[key]);
                }
            }
        }
    }

    function readConfig() {
        var fileExists = IO.existsFile(setupJsonPath);
        if (fileExists) {
            var text = IO.readTextFile(setupJsonPath);
            defaultConfig = JSON.parse(text);
        }
    }

    export function init() {
        readConfig();
        setConfigDOM();
        onDOMChange();
    }

} 