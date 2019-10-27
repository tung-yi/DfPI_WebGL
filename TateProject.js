//import regl
var regl = require('regl')()

//create a clear function to clear the background
var clear = () => {
  regl.clear({
    color: [1, 1, 1, 1,] //white
  })
}
var aspectRatio = window.innerWidth / window.innerHeight;
//define the size of the square
var r = 0.5
var num = 50
var start = num / 2
//define the points position


// color palette


var color1 = [0.415, 0.513, 0.447] //oitake -light green
var color5 = [0.447, 0.388, 0.431] //hatobanezumi - dark purple gray
var color2 = [0.607, 0.564, 0.760] //ouchi - purple 
var color6 = [0.843, 0.725, 0.556] //tonoko - beige
var color3 = [0.792, 0.678, 0.372] //karashi - yellow green
var color7 = [0.529, 0.498, 0.423] //aku - gray brown
var color4 = [0.858, 0.556, 0.443] //tokigaracha - muted salmon
var color8 = [0.568, 0.705, 0.576] //usuao - mint green

//create 8 triangles to form the square
var points = [
  [-r, r, 0],
  [0, r, 0],
  [0, 0, 0],

  [0, r, 0],
  [r, r, 0],
  [0, 0, 0],

  [r, r, 0],
  [r, 0, 0],
  [0, 0, 0],

  [r, 0, 0],
  [r, -r, 0],
  [0, 0, 0],

  [r, -r, 0],
  [0, -r, 0],
  [0, 0, 0],

  [0, -r, 0],
  [-r, -r, 0],
  [0, 0, 0],

  [-r, -r, 0],
  [-r, 0, 0],
  [0, 0, 0],

  [-r, 0, 0],
  [-r, r, 0],
  [0, 0, 0],
]

var triangleColours = [
  color1,
  color1,
  color1,

  color2,
  color2,
  color2,

  color3,
  color3,
  color3,

  color4,
  color4,
  color4,

  color5,
  color5,
  color5,

  color6,
  color6,
  color6,

  color7,
  color7,
  color7,

  color8,
  color8,
  color8
]

var fragmentShader = `
precision mediump float;
varying vec3 vColor;

void main(){
    gl_FragColor = vec4(vColor, 1.0);
}
`

var vertexShader = `
precision mediump float;
attribute vec3 aPosition;
attribute vec3 aColor;

varying vec3 vColor;

uniform vec3 uTranslate;
uniform float uAspectRatio;
void main() {
    vec3 pos = aPosition;
    pos += uTranslate;
    pos *= vec3(0.1, 0.1 * uAspectRatio, 0);
    gl_Position = vec4(pos, 1.0);
    vColor = aColor;
}
`

var drawTriangles = regl({
  frag: fragmentShader,
  vert: vertexShader,
  attributes: {
    aPosition: regl.buffer(points),
    aColor: regl.buffer(triangleColours),
  },
  uniforms:{
    uTranslate: regl.prop('translate'),
    uAspectRatio: regl.prop('ratio')
  },
  count: 24
})

function render() {

  for (var i = 0; i < num; i++) {
    for (var j = 0; j < num; j++) {
      var obj = {
        translate: [-start + i, -start + j, 0],
        ratio: aspectRatio
      }
      drawTriangles(obj)
    }
  }
  window.requestAnimationFrame(render)
}

render()