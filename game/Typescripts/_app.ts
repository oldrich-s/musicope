module Musicope {
    export var dropbox = new Dropbox.Client({ key: "ckt9l58i8fpcq6d" });

    export var game: Game.Game;

    $(document).ready(() => {
        List.init();
    });
} 