module Musicope.Game.SceneFns {

    export interface IAttribute {
        name: string;
        dim: number;
    }

    export class WebGL {

        private gl: any;
        private buffer: any;
        private attributeLocs: number[];
        private attrLength: number;
        private udx;
        private udy;
        private uactive;

        constructor(canvas: HTMLCanvasElement, private attributes: IAttribute[]) {
            var o = this;
            o.gl = WebGL.getContext(canvas);
            o.gl.blendFunc(o.gl.SRC_ALPHA, o.gl.ONE_MINUS_SRC_ALPHA);
            o.gl.enable(o.gl.BLEND);
            o.gl.disable(o.gl.DEPTH_TEST);
            o.initShaders();
        }

        redraw(dx: number, dy: number, pressedNotes: Int32Array) {
            var o = this;
            o.gl.clear(o.gl.COLOR_BUFFER_BIT);
            o.gl.uniform1f(o.udx, dx); // creates garbage! ca 200
            o.gl.uniform1f(o.udy, dy); // creates garbage! ca 200
            o.gl.uniform1iv(o.uactive, pressedNotes);
            o.gl.drawArrays(o.gl.TRIANGLES, 0, o.attrLength);
        }

        setBuffer(bufferData: Float32Array) {
            var o = this;

            var dims = 0;
            o.attributes.forEach((attr) => { dims += attr.dim; });
            o.attrLength = bufferData.length / dims;

            if (o.buffer) { o.gl.deleteBuffer(o.buffer); }
            o.buffer = o.gl.createBuffer();
            o.gl.bindBuffer(o.gl.ARRAY_BUFFER, o.buffer);
            o.gl.bufferData(o.gl.ARRAY_BUFFER, bufferData, o.gl.STATIC_DRAW);
            o.assignAttribPointers();
        }

        setClearColor(rgba: Int32Array) {
            var o = this;
            o.gl.clearColor(rgba[0], rgba[1], rgba[2], rgba[3]);
        }

        private initShaders() {
            var o = this;

            var vertexShader = o.getShader(".vertex");
            var fragmentShader = o.getShader(".fragment");
            var shaderProgram = this.gl.createProgram();
            this.gl.attachShader(shaderProgram, vertexShader);
            this.gl.attachShader(shaderProgram, fragmentShader);
            this.gl.linkProgram(shaderProgram);
            if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
                alert("Unable to initialize the shader program.");
            }
            this.gl.useProgram(shaderProgram);

            o.udx = o.gl.getUniformLocation(shaderProgram, "u_dx");
            o.udy = o.gl.getUniformLocation(shaderProgram, "u_dy");
            o.uactive = o.gl.getUniformLocation(shaderProgram, "u_active");

            o.attributeLocs = <any>o.attributes.map((attr) => {
                return o.gl.getAttribLocation(shaderProgram, attr.name);
            });
            o.attributeLocs.forEach((attr) => {
                o.gl.enableVertexAttribArray(attr);
            });
        }



        private assignAttribPointers() {
            var o = this;
            var pos = 0;
            o.attributeLocs.forEach((loc, i) => {
                var dim = o.attributes[i].dim;
                o.gl.vertexAttribPointer(loc, dim, o.gl.FLOAT, false, 44, pos);
                pos += dim * 4;
            });
        }

        static getContext(canvas: any) {
            return canvas.getContext("experimental-webgl", { antialias: true });
        }

        private getShader(id: string) {
            var o = this;
            var shader;
            if (id === ".fragment") {
                shader = o.gl.createShader(o.gl.FRAGMENT_SHADER);
            } else if (id === ".vertex") {
                shader = o.gl.createShader(o.gl.VERTEX_SHADER);
            }
            o.gl.shaderSource(shader, $(id).text().trim());
            o.gl.compileShader(shader);
            if (!o.gl.getShaderParameter(shader, o.gl.COMPILE_STATUS)) {
                var lastError = o.gl.getShaderInfoLog(shader);
                o.gl.deleteShader(shader);
                alert("Error compiling shader '" + shader + "':" + lastError);
            }
            return shader;
        }

    }

} 