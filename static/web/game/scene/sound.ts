interface Dictionary<T> {
    [Key: string]: T;
}

export class Sound {
    synthkeys: Dictionary<OscillatorNode>;
    context: AudioContext;
    active: Dictionary<boolean>;

    public constructor() {
        this.synthkeys = {};
        this.active = {};
        this.context = new AudioContext();

        for (let note = 1; note < 139; note++) {
            let o = this.context.createOscillator();
            o.frequency.setTargetAtTime(Math.pow(2, (note - 69) / 12) * 440, this.context.currentTime, 0);
            o.start(0);
            this.synthkeys[note] = o;
        }
    }

    start(id) {
        this.synthkeys[id].connect(this.context.destination);
        this.active[id] = true;
    }

    stop(id) {
        if (this.active[id] == true) {
            this.synthkeys[id].disconnect(this.context.destination);
        }
        this.active[id] = false;
    }

    stop_all() {
        for (let note in this.synthkeys) {
            this.stop(note);
        }
    }
}