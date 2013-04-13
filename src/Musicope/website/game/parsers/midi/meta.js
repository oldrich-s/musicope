define(["require", "exports"], function(require, exports) {
    function sequencerSpecific(arr) {
        return arr;
    }
    function keySignature(arr) {
        return {
            key: arr[0],
            scale: arr[1]
        };
    }
    function timeSignature(arr) {
        return {
            numer: arr[0],
            denom: arr[1],
            metro: arr[2],
            nds32: arr[3]
        };
    }
    function smpteOffset(arr) {
        return {
            hour: arr[0],
            min: arr[1],
            sec: arr[2],
            fr: arr[3],
            subfr: arr[4]
        };
    }
    function setTempo(arr) {
        return 256 * 256 * arr[0] + 256 * arr[1] + arr[2];
    }
    function endOfTrack(arr) {
        return true;
    }
    function midiChannelPrefix(arr) {
        return arr[0];
    }
    function toText(arr) {
        var text;
        for(var i = 0; i < arr.byteLength; i++) {
            text += String.fromCharCode(arr[i]);
        }
        return text;
    }
    function sequenceNumber(arr) {
        return {
            MSB: arr[0],
            LSB: arr[1]
        };
    }
    var metaTypes = {
        0: {
            name: "sequenceNumber",
            fn: sequenceNumber
        },
        1: {
            name: "text",
            fn: toText
        },
        2: {
            name: "copyrightNotice",
            fn: toText
        },
        3: {
            name: "sequenceOrTrackName",
            fn: toText
        },
        4: {
            name: "InstrumentName",
            fn: toText
        },
        5: {
            name: "lyrics",
            fn: toText
        },
        6: {
            name: "marker",
            fn: toText
        },
        7: {
            name: "cuePoint",
            fn: toText
        },
        32: {
            name: "midiChannelPrefix",
            fn: midiChannelPrefix
        },
        47: {
            name: "endOfTrack",
            fn: endOfTrack
        },
        81: {
            name: "setTempo",
            fn: setTempo
        },
        84: {
            name: "smpteOffset",
            fn: smpteOffset
        },
        88: {
            name: "timeSignature",
            fn: timeSignature
        },
        89: {
            name: "keySignature",
            fn: keySignature
        },
        127: {
            name: "sequencerSpecific",
            fn: sequencerSpecific
        }
    };
    function parseMetaEvent(metaType, arr) {
        var event = metaTypes[metaType];
        return {
            name: event["name"],
            value: event["fn"](arr)
        };
    }
    exports.parseMetaEvent = parseMetaEvent;
})
//@ sourceMappingURL=meta.js.map
