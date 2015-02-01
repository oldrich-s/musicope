module Musicope.Game.Devices {

    export interface IDevice {
        init(): JQueryDeferred<void>;
        inOpen(callback: (timestamp: number, byte1: number, byte2: number, byte3: number) => void): void;
        inClose(): void;
        inList(): string[];
        exists(): boolean;
        out(byte1: number, byte2: number, byte3: number): void;
        outClose(): void;
        outList(): string[];
        outOpen(): void;
        time(): number;
    }

} 