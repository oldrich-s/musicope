var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (Scenes) {
            (function (BasicFns) {
                var WebGL = (function () {
                    function WebGL(canvas, attributes) {
                        this.attributes = attributes;
                        var o = this;
                        o.gl = WebGL.getContext(canvas);
                        o.gl.blendFunc(o.gl.SRC_ALPHA, o.gl.ONE_MINUS_SRC_ALPHA);
                        o.gl.enable(o.gl.BLEND);
                        o.gl.disable(o.gl.DEPTH_TEST);
                        o.initShaders();
                    }
                    WebGL.prototype.redraw = function (dx, dy, pressedNotes) {
                        var o = this;
                        o.gl.clear(o.gl.COLOR_BUFFER_BIT);
                        o.gl.uniform1f(o.udx, dx); // creates garbage! ca 200
                        o.gl.uniform1f(o.udy, dy); // creates garbage! ca 200
                        o.gl.uniform1iv(o.uactive, pressedNotes);
                        o.gl.drawArrays(o.gl.TRIANGLES, 0, o.attrLength);
                    };

                    WebGL.prototype.setBuffer = function (bufferData) {
                        var o = this;

                        var dims = 0;
                        o.attributes.forEach(function (attr) {
                            dims += attr.dim;
                        });
                        o.attrLength = bufferData.length / dims;

                        if (o.buffer) {
                            o.gl.deleteBuffer(o.buffer);
                        }
                        o.buffer = o.gl.createBuffer();
                        o.gl.bindBuffer(o.gl.ARRAY_BUFFER, o.buffer);
                        o.gl.bufferData(o.gl.ARRAY_BUFFER, bufferData, o.gl.STATIC_DRAW);
                        o.assignAttribPointers();
                    };

                    WebGL.prototype.setClearColor = function (rgba) {
                        var o = this;
                        o.gl.clearColor(rgba[0], rgba[1], rgba[2], rgba[3]);
                    };

                    WebGL.prototype.initShaders = function () {
                        var o = this;

                        var vertexShader = o.getShader("scenes/basic/_assets/vertex.glsl");
                        var fragmentShader = o.getShader("scenes/basic/_assets/fragment.glsl");
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

                        o.attributeLocs = o.attributes.map(function (attr) {
                            return o.gl.getAttribLocation(shaderProgram, attr.name);
                        });
                        o.attributeLocs.forEach(function (attr) {
                            o.gl.enableVertexAttribArray(attr);
                        });
                    };

                    WebGL.prototype.assignAttribPointers = function () {
                        var o = this;
                        var pos = 0;
                        o.attributeLocs.forEach(function (loc, i) {
                            var dim = o.attributes[i].dim;
                            o.gl.vertexAttribPointer(loc, dim, o.gl.FLOAT, false, 44, pos);
                            pos += dim * 4;
                        });
                    };

                    WebGL.getContext = function (canvas) {
                        return canvas.getContext("experimental-webgl", { antialias: true });
                    };

                    WebGL.prototype.getShader = function (path) {
                        var o = this;
                        var xhr = new XMLHttpRequest();
                        xhr.open('GET', path, false);
                        xhr.send();
                        var shader;
                        if (path.indexOf("fragment.glsl") > 0) {
                            shader = o.gl.createShader(o.gl.FRAGMENT_SHADER);
                        } else if (path.indexOf("vertex.glsl") > 0) {
                            shader = o.gl.createShader(o.gl.VERTEX_SHADER);
                        }
                        o.gl.shaderSource(shader, xhr.responseText);
                        o.gl.compileShader(shader);
                        if (!o.gl.getShaderParameter(shader, o.gl.COMPILE_STATUS)) {
                            var lastError = o.gl.getShaderInfoLog(shader);
                            o.gl.deleteShader(shader);
                            alert("Error compiling shader '" + shader + "':" + lastError);
                        }
                        return shader;
                    };
                    return WebGL;
                })();
                BasicFns.WebGL = WebGL;
            })(Scenes.BasicFns || (Scenes.BasicFns = {}));
            var BasicFns = Scenes.BasicFns;
        })(Game.Scenes || (Game.Scenes = {}));
        var Scenes = Game.Scenes;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
//# sourceMappingURL=webgl.js.map
