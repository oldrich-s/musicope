declare var MidiFile;

module Musicope.Game.Parsers.Midi {


    interface IParser2 extends IParser {
        ticksPerQuarter: number;
        timePerQuarter: number;
        timePerTick: number;
        beatsPerBar: number;
    };

    function processMessage(o: IParser2, v, time) {
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

    function processMeta(o: IParser2, v) {
        switch (v.subtype) {
            case "setTempo":
                o.timePerQuarter = v.microsecondsPerBeat / 1000;    
                break;
            case "timeSignature":
                o.beatsPerBar = v.numerator;
                o.noteValuePerBeat = v.denominator;
                break;
        }
    }

    function parsePlayerTrack(o: IParser2, track: any []) {
        var ticks = 0;
        o.tracks.push([]);
        track.forEach((v) => {
            ticks = ticks + v.deltaTime;
            if (v.type == "meta") {
                processMeta(o, v);
            } else if (v.type == "channel") {
                if (o.timePerBeat == 0) {
                    o.timePerBeat = o.timePerQuarter * 4 / o.noteValuePerBeat;
                    o.timePerTick = o.timePerQuarter / o.ticksPerQuarter;
                    o.timePerBar = o.timePerBeat * o.beatsPerBar;
                }
                var time = ticks * o.timePerTick;
                processMessage(o, v, time);
            }
        });
    }

    function parsePlayerTracks(midi, o: IParser2) {
        midi.tracks.forEach((track, i) => {
            parsePlayerTrack(o, track);
        });
        if (o.tracks[0].length == 0) {
            o.tracks.shift();
        }
    }

    function parseHeader(midi, o: IParser2) {
        o.ticksPerQuarter = midi.header.ticksPerBeat;
    }

    export function parseMidi(midi: Uint8Array): IParser {
        var str = String.fromCharCode.apply(null, midi);        
        var midiFile = MidiFile(str);
        var parser: IParser2 = {
            timePerBeat: 0,
            timePerBar: 0,
            noteValuePerBeat: 4, // denominator in time signature: 2, 4, 8, 16 ...
            tracks: [],
            sustainNotes: [],
            ticksPerQuarter: 0,
            timePerQuarter: 500,
            timePerTick: 0,
            beatsPerBar: 4
        };
        parseHeader(midiFile, parser);
        parsePlayerTracks(midiFile, parser);
        return parser;
    }

}