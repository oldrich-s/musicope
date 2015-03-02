module Musicope.Game {

    export interface IDriver extends IDisposable {
        ready: JQueryDeferred<void>;
        inList(): string[];
        outList(): string[];
        inOpen(callback: (timestamp: number, byte1: number, byte2: number, byte3: number) => void): void;
        outOpen(): void;
        inClose(): void;
        outClose(): void;
        out(byte1: number, byte2: number, byte3: number): void;
    }

} 