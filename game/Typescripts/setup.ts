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

    export function init() {
        var fileExists = fs.existsSync(setupJsonPath);
        if (fileExists) {
            var text = fs.readFileSync(setupJsonPath, "utf-8");
            defaultConfig = JSON.parse(text);
        }

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

        $('.setupPage input').change(function (e) {
            var el = $(this);
            if (el.attr('id') in defaultConfig) {
                defaultConfig[el.attr('id')] = getValue(el);
                fs.writeFile(setupJsonPath, JSON.stringify(defaultConfig, null, 4));
            } else {
                var m = el.attr('id').match(/^(.+)_(\d)$/);
                if (m.length == 3) {
                    if (m[1] in defaultConfig) {
                        defaultConfig[m[1]][parseInt(m[2])] = getValue(el);
                        fs.writeFile(setupJsonPath, JSON.stringify(defaultConfig, null, 4));
                    }
                }
            }
        });

    }

} 