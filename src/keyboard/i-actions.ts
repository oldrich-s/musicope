import { Song } from "../song/song";

export interface IKeyboardAction {
    title: string;
    description: string;
    triggerAction(song: Song): void;
    getCurrentState(): any;
}