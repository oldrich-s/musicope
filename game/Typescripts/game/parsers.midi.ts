declare var MidiFile;

module Musicope.Game.Parsers.Midi {

    function processMessage(o: IParser, v, time) {
        switch (v.subtype) {
            case "noteOn":
            case "noteOff":
                o.tracks[o.tracks.length - 1].push({
                    on: v.subtype == "noteOn",
                    time: time,
                    id: v.noteNumber,
                    velocity: v.velocity
                });
                break;
            case "controller":
                if (v.controllerType == 64) { // sustain
                    o.sustainNotes.push({ on: v.value > 63, time: time });
                }
                break;
        }
    }

    function createSignature(signatures: { [msecs: number]: ISignature }, msecs: number) {
        if (!(msecs in signatures)) {
            var keys = Object.keys(signatures).sort((a, b) => Number(b) - Number(a));
            var fkeys = keys.filter((s) => { return Number(s) < msecs; });
            signatures[msecs] = $.extend({}, signatures[fkeys[0]]);
        }
    }

    function processMeta(o: IParser, v, msecs: number) {
        switch (v.subtype) {
            case "setTempo":
                createSignature(o.signatures, msecs);
                o.signatures[msecs].msecsPerBeat = v.microsecondsPerBeat / 1e3;
                break;
            case "timeSignature":
                createSignature(o.signatures, msecs);
                o.signatures[msecs].beatsPerBar = v.numerator;
                o.signatures[msecs].noteValuePerBeat = v.denominator;
                break;
        }
    }

    function findMSecPerBeat(o: IParser, msecs: number) {
        var keys = Object.keys(o.signatures).sort((a, b) => Number(b) - Number(a));
        var fkeys = keys.filter((s) => { return Number(s) < msecs + 10; });
        return o.signatures[fkeys[0]].msecsPerBeat;
    }

    function parsePlayerTrack(o: IParser, track: any[]) {
        var msecs = 0;
        o.tracks.push([]);
        track.forEach((v) => {
            if (v.type == "meta") {
                processMeta(o, v, msecs);
            } else if (v.type == "channel") {
                var msecsPerBeat = findMSecPerBeat(o, msecs);
                msecs = msecs + msecsPerBeat * v.deltaTime / o.ticksPerBeat;
                processMessage(o, v, msecs);
            }
        });
    }

    function parsePlayerTracks(midi, o: IParser) {
        midi.tracks.forEach((track, i) => {
            parsePlayerTrack(o, track);
        });
        var tracks = [];
        o.tracks.forEach((track) => {
            if (track.length > 0) {
                tracks.push(track);
            }
        });
        o.tracks = tracks;
    }

    function parseHeader(midi, o: IParser) {
        o.ticksPerBeat = midi.header.ticksPerBeat;
    }

    function computeMSecPerBars(o: IParser) {
        Object.keys(o.signatures).forEach((key) => {
            var sig: ISignature = o.signatures[key];
            sig.msecsPerBar = sig.msecsPerBeat * sig.beatsPerBar * 4.0 / sig.noteValuePerBeat;    
        });
    }

    export function parseMidi(midi: string): IParser {
        var midiFile = MidiFile(midi);
        var parser: IParser = {
            ticksPerBeat: 0,
            signatures: {
                0: {
                    msecsPerBeat: 500,
                    beatsPerBar: 4,
                    noteValuePerBeat: 4,
                    msecsPerBar: 2000
                }
            },
            tracks: [],
            sustainNotes: []
        };
        parseHeader(midiFile, parser);
        parsePlayerTracks(midiFile, parser);
        computeMSecPerBars(parser);
        return parser;
    }

}