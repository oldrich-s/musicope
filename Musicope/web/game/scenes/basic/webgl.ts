/// <reference path="../../_references.ts" />

export interface IUniform {
  name: string;
  type: string;
}

export interface IAttribute {
  name: string;
  dim: number;
}

export class WebGL {

  private gl: IWebGL.WebGLRenderingContext;
  private buffer: IWebGL.WebGLBuffer;
  private uniformLocs: IWebGL.WebGLUniformLocation[];
  private attributeLocs: number[];
  private attrLength: number;

  constructor(canvas: HTMLCanvasElement, private uniforms: IUniform[], private attributes: IAttribute[]) {
    var o = this;
    o.gl = WebGL.getContext(canvas);
    o.initShaders();
  }

  redraw(uniforms: any[]) {
    var o = this;
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    uniforms.forEach((uniform, i) => {
      if (o.uniforms[i].type == "number") {
        this.gl.uniform1f(o.uniformLocs[i], uniform);
      } else if (o.uniforms[i].type == "Int32Array") {
        this.gl.uniform1iv(o.uniformLocs[i], uniform);
      } else {
        alert("I do not understand the type");
      }
    });
    this.gl.drawArrays(this.gl.TRIANGLES, 0, o.attrLength);
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

  setClearColor(r: number, g: number, b: number, a: number) {
    this.gl.clearColor(r, g, b, a);
  }

  private initShaders() {
    var o = this;

    var vertexShader = WebGL.getShader("viewer/webgl/assets/vertex.glsl");
    var fragmentShader = WebGL.getShader("viewer/webgl/assets/fragment.glsl");
    var shaderProgram = this.gl.createProgram();
    this.gl.attachShader(shaderProgram, vertexShader);
    this.gl.attachShader(shaderProgram, fragmentShader);
    this.gl.linkProgram(shaderProgram);
    if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
      alert("Unable to initialize the shader program.");
    }
    this.gl.useProgram(shaderProgram);
    o.uniformLocs = o.uniforms.map((uni) => {
      return o.gl.getUniformLocation(shaderProgram, uni.name);
    });
    o.attributeLocs = o.attributes.map((attr) => {
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

  static getContext(canvas: HTMLCanvasElement) {
    return canvas.getContext("experimental-webgl", { antialias: true });
  }

  static private getShader(path: string) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', path, false);
    xhr.send();
    var shader: IWebGL.WebGLShader;
    if (path.indexOf("fragment.glsl") > 0) {
      shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    } else if (path.indexOf("vertex.glsl") > 0) {
      shader = this.gl.createShader(this.gl.VERTEX_SHADER);
    }
    this.gl.shaderSource(shader, xhr.responseText);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      var lastError = this.gl.getShaderInfoLog(shader);
      this.gl.deleteShader(shader);
      alert("Error compiling shader '" + shader + "':" + lastError);
    }
    return shader;
  }

}