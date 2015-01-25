// time units = miliseconds
module Musicope.Game {

    export interface ISustainNoteScene {
        timeOn: number;
        timeOff: number;
    }

    export interface INoteScene {
        timeOn: number;
        timeOff: number;
        id: number;
        velocityOn: number;
        velocityOff: number;
    }

} 