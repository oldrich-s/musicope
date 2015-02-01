module Musicope {
    export var dropbox = new Dropbox.Client({ key: "ckt9l58i8fpcq6d" });

    $(document).ready(() => {

        var canvas: HTMLCanvasElement = <any>$('.canvas')[0];
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        $(window).resize(() => {
            if (canvas.style.display !== 'none') {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        });

        List.init();

    });
} 