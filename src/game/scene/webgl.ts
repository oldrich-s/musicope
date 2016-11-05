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
    private u_activeID;
    private uactive;

    constructor(canvas: HTMLCanvasElement, private attributes: IAttribute[]) {
        var o = this;
        o.gl = WebGL.getContext(canvas);
        o.gl.blendFunc(o.gl.SRC_ALPHA, o.gl.ONE_MINUS_SRC_ALPHA);
        o.gl.enable(o.gl.BLEND);
        o.gl.disable(o.gl.DEPTH_TEST);
        o.initShaders();
    }

    redraw(dx: number, dy: number, activeID: number, pressedNotes: Int32Array) {
        var o = this;
        o.gl.clear(o.gl.COLOR_BUFFER_BIT);
        o.gl.uniform1f(o.udx, dx);
        o.gl.uniform1f(o.udy, dy);
        o.gl.uniform1i(o.u_activeID, activeID);
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

        var vertexShader = o.getShader(false);
        var fragmentShader = o.getShader(true);
        var shaderProgram = o.gl.createProgram();
        o.gl.attachShader(shaderProgram, vertexShader);
        o.gl.attachShader(shaderProgram, fragmentShader);
        o.gl.linkProgram(shaderProgram);
        if (!o.gl.getProgramParameter(shaderProgram, o.gl.LINK_STATUS)) {
            alert("Unable to initialize the shader program.");
        }
        o.gl.useProgram(shaderProgram);

        o.udx = o.gl.getUniformLocation(shaderProgram, "u_dx");
        o.udy = o.gl.getUniformLocation(shaderProgram, "u_dy");
        o.u_activeID = o.gl.getUniformLocation(shaderProgram, "u_activeID");
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
        return canvas.getContext("webgl", { antialias: true });
    }

    private getShader(isFragment: boolean) {
        var o = this;
        var shader;
        if (isFragment) {
            shader = o.gl.createShader(o.gl.FRAGMENT_SHADER);
        } else {
            shader = o.gl.createShader(o.gl.VERTEX_SHADER);
        }
        var content = isFragment ? o.fragmentShader : o.vertexShader;
        o.gl.shaderSource(shader,  content);
        o.gl.compileShader(shader);
        if (!o.gl.getShaderParameter(shader, o.gl.COMPILE_STATUS)) {
            var lastError = o.gl.getShaderInfoLog(shader);
            o.gl.deleteShader(shader);
            alert("Error compiling shader '" + shader + "':" + lastError);
        }
        return shader;
    }

    private fragmentShader = `
        precision mediump float;
        varying lowp vec4 v_color;

        void main() {
            gl_FragColor = v_color;
        }
    `;

    private vertexShader = `
        uniform float u_dy;
        uniform float u_dx;
        uniform int u_activeID;
        uniform bool u_active[127];
        attribute vec2 a_position;
        attribute vec4 a_color;
        attribute float a_id;
        attribute vec4 a_activeColor;
        varying lowp vec4 v_color;
        
        void main() {
            int id = int(a_id);

            if (id > 199) { // movable
                gl_Position = vec4(a_position.x, a_position.y + u_dy, 0, 1);
            } else if(id == 2) {
                gl_Position = vec4(a_position.x + u_dx, a_position.y, 0, 1);
            } else { // fixed
                gl_Position = vec4(a_position.x, a_position.y, 0, 1);
            }

            vec4 outc = a_color;
            if ( (id < 127 && u_active[id]) || (id > 199 && id - 200 < u_activeID) ) {
                outc = a_activeColor;
            }
            v_color = outc;
        }
    `;

}