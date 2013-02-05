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

export class Jazz implements IDevice {

  private jazz: IJazz;

  constructor() {
    this.jazz = <any>document.getElementById("Jazz");
  }

  inOpen(nameOrIndex, callback) {
    this.jazz.MidiInOpen(<string>nameOrIndex, callback);
  }

  inClose() {
    this.jazz.MidiInClose();
  }

  inList() {
    return this.jazz.MidiInList();
  }

  exists() { return this.jazz && this.jazz.isJazz; }

  out(byte1: number, byte2: number, byte3: number) {
    this.jazz.MidiOut(byte1, byte2, byte3);
  }

  outClose() {
    this.jazz.MidiOutClose();
  }

  outList() {
    return this.jazz.MidiOutList();
  }

  outOpen(name) {
    this.jazz.MidiOutOpen(<string>name);
  }

  time() {
    return this.jazz.Time();
  }
}