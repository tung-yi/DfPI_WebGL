module.exports = `
#define NUM_OCTAVES 5

precision mediump float;
varying vec3 vColor;
varying vec2 vUV;
varying float vYPosition;

uniform float uTime;
uniform vec3 uTranslate;

//const float PI = 3.141592653;

void main(){
  vec3 finalColor = uTranslate / 5.0 * 0.5 + 0.5;
  gl_FragColor = vec4(finalColor, 1.0);

  vec3 red = vec3 (0.5,0.1,1.0);
  vec3 yellow = vec3(0.9, 0.8, 0);

  finalColor = mix(red, yellow, vYPosition);

    gl_FragColor= vec4(finalColor, 1.0);
}`
