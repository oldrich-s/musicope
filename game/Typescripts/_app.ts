module Musicope {
    export var dropbox = new Dropbox.Client({ key: "ckt9l58i8fpcq6d" });

    $(document).ready(() => {
        List.init();
    });
} 