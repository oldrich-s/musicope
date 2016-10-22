var oldTimeOut: number;

export function display(description: string, value: any) {
    var str;
    if (typeof value == "number") { str = Math.round(1000 * value) / 1000; }
    else { str = value; }

    $('.canvasInfoDesc').text(description + ": ");
    $('.canvasInfoValue').text(str);
    $('.canvasInfo').show();
    clearTimeout(oldTimeOut);
    oldTimeOut = setTimeout(() => {
        $('.canvasInfo').hide();
    }, 5000);
}