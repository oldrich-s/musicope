/// <reference path="../../_references.ts" />

import defParams = module("../../_paramsDefault");
import paramService = module("../../../common/services.params");

export class Basic implements IMetronome {

  params: IMetronomeParams;

  private lastPlayedId: number;
  private timePerBeat: number; 
  private beatsPerBar: number; 
  private device: IDevice;

  constructor() { }

  _init(timePerBeat: number, beatsPerBar: number, device: IDevice, params: IMetronomeParams) {
    this.timePerBeat = timePerBeat;
    this.beatsPerBar = beatsPerBar;
    this.device = device;
    this.params = paramService.copy(params, defParams.iMetronomeParams);
  }

  play(time: number) {
    var o = this;
    if (o.params.m_velocity > 0) {
      var id = Math.floor(o.params.m_ticksPerBeat * time / o.timePerBeat);
      if (!o.lastPlayedId) { o.lastPlayedId = id; }
      if (id > o.lastPlayedId) {
        o.device.out(o.params.m_channel, id % o.beatsPerBar == 0 ? o.params.m_id1 : o.params.m_id2, Math.min(127, o.params.m_velocity));
        o.lastPlayedId = id;
      }
    }
  }

  reset() { this.lastPlayedId = undefined; }

}