define(["require", "exports"], function(require, exports) {
    function readVariableLength(index) {
        var value = this.midi[index++];
        if(value & 128) {
            value = value & 127;
            do {
                var c = this.midi[index++];
                value = (value << 7) + (c & 127);
            }while(c & 128);
        }
        return {
            value: value,
            newIndex: index
        };
    }
    exports.readVariableLength = readVariableLength;
})
//@ sourceMappingURL=tools.js.map
