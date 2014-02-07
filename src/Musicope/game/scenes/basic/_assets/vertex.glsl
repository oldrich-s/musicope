uniform float u_dy;
uniform float u_dx;
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
  if (id < 127 && u_active[id]) { outc = a_activeColor; }
  v_color = outc;
}