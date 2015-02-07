module Musicope.Game.Inputs.KeyboardFns.Actions {

    export interface IKeyboardAction {
        id: string;
        description: string;
        key: string;
        triggerAction(): void;
        getCurrentState(): any;
    }

    export interface IKeyboardParams {
        song: ISong;
        actions: JQueryPromise<IKeyboardAction[]>;
    }

    export interface IKeyboardActionsNew {
        new (params: IKeyboardParams): IKeyboardAction;
    }

}
 