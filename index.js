const regl = require('regl')()

const glm = require('gl-matrix')
var mat4 = glm.mat4;
var projectionMatrix = mat4.create();
var fov = 45 * Math.PI/180;
var aspect = window.innerWidth / window.innerHeight;
var near = 0.01;
var far = 1000.0


mat4.perspective(projectionMatrix, fov, aspect, near, far); //perspective(out, fovy, aspect, near, far)

var viewMatrix = mat4.create()
mat4.lookAt(viewMatrix, [0, 0, 2], [0, 0, 0], [0, 1, 0]); //lookAt(out, eye, center, up)


console.log(projectionMatrix) //identity matrix

var currTime = 0

const r = 0.15
const points = [
    //triangle 1
    [-r, r, 0],
    [r, r, 0],
    [r, -r, 0],

    //triangle 2
    [-r, r, 0],
    [-r, -r, 0],
    [r, -r, 0]
];

var colors = [
    [0.9, 0.5, 0.4],
    [0, 0.8, 0.7],
    [0.4, 0.8, 0.5],

    [0.9, 0.5, 0.4],
    [0, 0.8, 0.7],
    [0.4, 0.8, 0.5]

]
//buffer is a big array combined into a single line, the following code defines the buffer using regl

var attributes = {
    position: regl.buffer(points),
    aColor: regl.buffer(colors)
}

var vertexShader = `
precision mediump float;
attribute vec3 position;
attribute vec3 aColor;

uniform float uTime;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

varying vec3 vColor;

void main() {
    //create holder for position
    vec3 pos = position;
    // add the time to the 'x' only
    //pos.x += uTime;

    float movingRange = 0.2;
    pos.x += sin(uTime) * movingRange;
    //pos.y += cos(uTime) * movingRange;

    //sin goes from -1 ~ 1

    gl_Position = uProjectionMatrix * uViewMatrix * vec4(pos, 1.0);
    vColor = aColor;
}`

var fragShader = `
precision mediump float;

varying vec3 vColor;

void main(){
    gl_FragColor = vec4(vColor, 1.0);
}
`

console.log('Attributes:', attributes)

const drawTriangles = regl({
uniforms: {
    uTime: regl.prop('time'),
    uProjectionMatrix: projectionMatrix,
    uViewMatrix: regl.prop('view')
},

    attributes: attributes,
    frag: fragShader,
    vert: vertexShader,
    count: 6
})



const clear = () => {
    regl.clear({
        color: [0, 0, 0, 1]
    })
}

function render(){

    currTime += 0.01
    let cameraX = Math.sin(currTime);
    let cameraZ = Math.cos(currTime);

    mat4.lookAt(viewMatrix, [cameraX, 0, cameraZ], [0, 0, 0], [0, 1, 0]); // to move the camera

    var obj = {
        time: currTime,
        view: viewMatrix
    }

    //console.log('Time :', currTime)
    console.log('render')
    clear() //clearing the background each frame
    drawTriangles(obj)
    window.requestAnimationFrame(render) //this is to clear the screen which is especially useful for animation on the screen
}

render()