module Musicope.Game {

    $(document).ready(() => {

        keyboardActions["backspace"] = {
            title: "Exit",
            description: "Exit the gameplay.",
            triggerAction: (song: Song) => {
                mainView.router.back();
            },
            getCurrentState: () => {
                return null;
            }
        };

    });

}