/// <reference path="../_interfaces.ts" />

interface IJazz {
  MidiInOpen(name: string, callback: (timestamp: number, byte1: number, byte2: number, byte3: number) => void ): void;
  MidiInOpen(index: number, callback: (timestamp: number, byte1: number, byte2: number, byte3: number) => void ): void;
  MidiInClose(): void;
  MidiInList(): string[];
  MidiOut(byte1: number, byte2: number, byte3: number): void;
  MidiOutClose(): void;
  MidiOutList(): string[];
  MidiOutOpen(name: string): void;
  MidiOutOpen(index: number): void;
  Time(): number;
  version: string;
  isJazz: bool;
}

var jazz: IJazz;

export class Jazz implements IDevice {

  constructor() {
    var o = this;
    if (!o.exists()) {
      jazz = <any>document.getElementById("Jazz");
    }
    window.onbeforeunload = () => {
      jazz.MidiInClose();
      jazz.MidiOutClose();
    }
  }

  inOpen(nameOrIndex, callback) {
    jazz.MidiInOpen(<string>nameOrIndex, callback);
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

  outOpen(name) {
    jazz.MidiOutOpen(<string>name);
  }

  time() {
    return jazz.Time();
  }
}