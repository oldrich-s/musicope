module Musicope.Devices {

    export interface IDevice {
        inOpen(name: any, callback: (timestamp: number, byte1: number, byte2: number, byte3: number) => void): void;
        inClose(): void;
        inList(): string[];
        exists(): boolean;
        out(byte1: number, byte2: number, byte3: number): void;
        outClose(): void;
        outList(): string[];
        outOpen(name: any): void;
        time(): number;
    }

    export interface IDeviceNew {
        new (): IDevice;
    }

} 