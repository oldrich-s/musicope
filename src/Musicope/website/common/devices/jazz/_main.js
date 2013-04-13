define(["require", "exports"], function(require, exports) {
    var jazz;
    var Jazz = (function () {
        function Jazz() {
            var o = this;
            if(!o.exists()) {
                o.init();
            }
            window.onbeforeunload = function () {
                jazz.MidiInClose();
                jazz.MidiOutClose();
            };
        }
        Jazz.prototype.inOpen = function (nameOrIndex, callback) {
            jazz.MidiInOpen(nameOrIndex, callback);
        };
        Jazz.prototype.inClose = function () {
            jazz.MidiInClose();
        };
        Jazz.prototype.inList = function () {
            return jazz.MidiInList();
        };
        Jazz.prototype.exists = function () {
            return jazz && jazz.isJazz;
        };
        Jazz.prototype.out = function (byte1, byte2, byte3) {
            jazz.MidiOut(byte1, byte2, byte3);
        };
        Jazz.prototype.outClose = function () {
            jazz.MidiOutClose();
        };
        Jazz.prototype.outList = function () {
            return jazz.MidiOutList();
        };
        Jazz.prototype.outOpen = function (name) {
            jazz.MidiOutOpen(name);
        };
        Jazz.prototype.time = function () {
            return jazz.Time();
        };
        Jazz.prototype.init = function () {
            var jazz1 = document.createElement("object");
            var jazz2 = document.createElement("object");
            jazz1.setAttribute("classid", "CLSID:1ACE1618-1C7D-4561-AEE1-34842AA85E90");
            jazz1.setAttribute("style", "margin-left:-1000px;");
            jazz2.setAttribute("type", "audio/x-jazz");
            jazz2.setAttribute("style", "visibility:hidden;");
            var styleStr = "visibility: visible; display:block; position:absolute; top:0; left:0; width:100%; height:100%; text-align: center; vertical-align:middle; font-size: xx-large; background-color: black; color: #ffe44c;";
            jazz2.innerHTML = '<div style="' + styleStr + '"><br />Please install <a style="color:red" href="http://jazz-soft.net/download/Jazz-Plugin/">JAZZ</a> plugin to make the game function. Thank you :-)</div>';
            jazz1.appendChild(jazz2);
            document.body.appendChild(jazz1);
            jazz = jazz1;
            if(!jazz || !jazz.isJazz) {
                jazz = jazz2;
            }
        };
        return Jazz;
    })();
    exports.Jazz = Jazz;    
})
//@ sourceMappingURL=_main.js.map
