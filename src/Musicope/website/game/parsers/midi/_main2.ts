/// <reference path="../../_references.ts" />

import midiToJsonM = module("./midiToJson");

function parseNoteOff(time: number, midi: {}) {
  return {
    time: time,
    on: false,
    id: midi["note"],
    velocity: midi["velocity"]
  };
}

function parseNoteOn(time: number, midi: {}) {
  return {
    time: time,
    on: midi["velocity"] > 0,
    id: midi["note"],
    velocity: midi["velocity"]
  };
}

function parseMidiEvent(time: number, midi: {}) {
  if (midi["type"] == "noteOn") {
    return parseNoteOn(time, midi);
  } else if (midi["type"] == "noteOff") {
    return parseNoteOff(time, midi);
  }
}

function parseChunk(chunk) {
  var time = 0;
  var result = (<any[]> chunk["value"]).map((event: {}) => {
    time = time + event["dTime"];
    if (event["type"] == "midi") {
      return parseMidiEvent(time, event["value"]);
    }
  });
  return result.filter((v) => { return v; });
}

function getNotes(chunks: any[]): IGame.INote[][] {
  var result = chunks.map((chunk) => {
    if (chunk["type"] == "track") {
      return parseChunk(chunk);
    }
  });
  return result.filter((v) => { return v; });
}

export class Midi2 implements IGame.IParser {

  timePerBeat: number;
  timePerBar: number;
  noteValuePerBeat: number; // denominator in time signature: 2, 4, 8, 16 ...
  tracks: IGame.INote[][] = [];
  sustainNotes: IGame.ISustainNote[] = [];

  private ticksPerQuarter: number;
  private timePerQuarter: number;
  private timePerTick: number;
  private beatsPerBar: number;

  constructor(private midi: Uint8Array) {
    var o = this;
    var json = midiToJsonM.parse(midi);
    o.tracks = getNotes(json);
  }

  


}