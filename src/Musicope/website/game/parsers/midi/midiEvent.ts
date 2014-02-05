module Musicope.Game.Parsers.Midi.MidiEvent {

  var oldTypeChannel;

  var types = {
    8: { type: "noteOff", v1: "note", v2: "velocity" },
    9: { type: "noteOn", v1: "note", v2: "velocity" },
    10: { type: "noteAftertouch", v1: "note", v2: "amount" },
    11: { type: "controller", v1: "type", v2: "value" },
    12: { type: "programChange", v1: "number" },
    13: { type: "channelAftertouch", v1: "amount" },
    14: { type: "pitchBend", v1: "lsb", v2: "msb" },
  }

function getValue(ob, channel, repeating, arr, i) {
    var value = {};
    value["type"] = ob["type"];
    value["channel"] = channel;
    value[ob["v1"]] = repeating ? arr[i] : arr[i + 1];
    if (ob["v2"]) {
      value[ob["v2"]] = repeating ? arr[i + 1] : arr[i + 2];
    }
    return value;
  }

  export function parse(dTime: number, arr: Uint8Array, i: number) {
    var repeating = arr[i] >> 4 < 8 || arr[i] >> 4 > 14;
    var typeChannel = repeating ? oldTypeChannel : arr[i];
    var type = typeChannel >> 4;
    var channel = typeChannel - type * 16;
    if (!repeating) {
      oldTypeChannel = arr[i];
    }
    var ob = types[type];
    return {
      type: "midi",
      dTime: dTime,
      value: getValue(ob, channel, repeating, arr, i),
      newi: i + (repeating ? 2 : 3) + (ob["v2"] ? 0 : -1)
    };
  }

}