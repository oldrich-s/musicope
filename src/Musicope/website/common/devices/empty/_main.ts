/// <reference path="../_interfaces.ts" />

export class Empty implements IDevice {

  constructor() {}

  inOpen(nameOrIndex, callback) {}

  inClose() {}

  inList() { return [""]; }

  exists() { return true; }

  out(byte1: number, byte2: number, byte3: number) {}

  outClose() {}

  outList() { return [""]; }

  outOpen(name) { }

  time() { return Date.now(); }

}