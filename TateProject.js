//import regl
var regl = require ('regl')()

//create a clear function to clear the background
var clear = () => {
    regl.clear({
        color: [1, 1, 1, 1,] //white
    })
}

//define the size of the square
var r = 0.5

//define the points position
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
    [0, 0 , 0],

    [-r, -r, 0],
    [-r, 0, 0],
    [0, 0, 0],

    [-r, 0, 0],
    [-r, r, 0],
    [0, 0, 0],
]

var triangleColours = [
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],

    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],

    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],

    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],

    [0, 1, 1],
    [0, 1, 1],
    [0, 1, 1],

    [1, 1, 0],
    [1, 1, 0],
    [1, 1, 0],
    
    [0.5, 0, 0],
    [0.5, 0, 0],
    [0.5, 0, 0],

    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
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

void main() {
    vec3 pos = aPosition;

    gl_Position = vec4(pos, 1.0);

    vColor = aColor;
}
`

var drawTriangles = regl({
    frag: fragmentShader,
    vert: vertexShader,
    attributes: {
        aPosition: regl.buffer(points), 
        aColor: regl.buffer(triangleColours)
    },
    count: 24
})

function render () {
    var num = 10
    
    drawTriangles()
}

render()