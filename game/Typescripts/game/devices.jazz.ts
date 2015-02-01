module Musicope.Game.Devices {

    interface IJazz {
        MidiInOpen(name: string, callback: (timestamp: number, byte1: number, byte2: number, byte3: number) => void): void;
        MidiInOpen(index: number, callback: (timestamp: number, byte1: number, byte2: number, byte3: number) => void): void;
        MidiInClose(): void;
        MidiInList(): string[];
        MidiOut(byte1: number, byte2: number, byte3: number): void;
        MidiOutClose(): void;
        MidiOutList(): string[];
        MidiOutOpen(name: string): void;
        MidiOutOpen(index: number): void;
        Time(): number;
        version: string;
        isJazz: boolean;
    }

    var jazz: IJazz;

    export class Jazz implements IDevice {

        constructor() {
            var o = this;
            window.onbeforeunload = () => {
                jazz.MidiInClose();
                jazz.MidiOutClose();
            }
        }

        inOpen(callback) {
            jazz.MidiInOpen(params.p_deviceIn, callback);
        }

        inClose() {
            jazz.MidiInClose();
        }

        inList() {
            return jazz.MidiInList();
        }

        exists() { return jazz && jazz.isJazz; }

        out(byte1: number, byte2: number, byte3: number) {
            jazz.MidiOut(byte1, byte2, byte3);
        }

        outClose() {
            jazz.MidiOutClose();
        }

        outList() {
            return jazz.MidiOutList();
        }

        outOpen() {
            jazz.MidiOutOpen(params.p_deviceOut);
        }

        time() {
            return jazz.Time();
        }

        init = () => {
            var o = this;
            if (!o.exists()) {

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

                jazz = <any> jazz1;
                if (!jazz || !jazz.isJazz) { jazz = <any> jazz2; }
            }
            return $.Deferred<void>().resolve();
        }

    }

} 