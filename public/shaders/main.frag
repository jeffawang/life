// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_texture;

void main() {

    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    // st /= 10.0;

    vec3 color = vec3(0.);
    color = vec3(st.x,st.y,abs(sin(u_time)));

    // vec4 texSample = texture2D(u_texture, st);
    vec4 texSample = texelFetch(u_texture, ivec2(gl_FragCoord.xy), 0);
    // texSample.r = st.x;

    gl_FragColor = texSample;
}