// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform int u_frame;
uniform sampler2D u_texture;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

bool lookup(ivec2 ij) {
    return texelFetch(u_texture, ivec2(gl_FragCoord.xy) + ij, 0).r > 0.5;
}

void main() {
    vec3 color = vec3(0.);

    if (u_frame < 30) {
        color = vec3(random(gl_FragCoord.xy));
    } else {
        // color = vec3(texture2D(u_texture, st, 0.0).r, 0.0, 0.0);
        bool alive = lookup(ivec2(0,0));
        
        int neighbors = 0;

        // i -1, 0, 1
        // j -1, 0, 1
        // (-1,-1), (0, -1), (1, -1)
        // (-1, 0), (0,  0), (1,  0)
        // (-1, 1), (0,  1), (1,  1)
        for (int i=-1; i<=1; i++) {
            for (int j=-1; j<=1; j++) {
                if (i == 0 && j == 0) {
                    continue;
                }
                if (lookup(ivec2(i,j))) {
                    neighbors += 1;
                }
            }
        }
        if (alive && (neighbors == 2 || neighbors == 3)) {
            color = vec3(1.0);
        } else if (!alive && neighbors == 3) {
            color = vec3(1.0);
        } else {
            color = vec3(0.0);
        }
        // color = vec3(1.0,0.0,0.0);
    }

    gl_FragColor = vec4(color,1.0);
}