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

var mouseX = 0
var mouseY = 0

window.addEventListener('mousemove', function(e){
    //console.log('Mouse move', e.clientX, e.clientY)

var percentX = e.clientX / window.innerWidth; // 0~1
var percentY = e.clientY / window.innerHeight; //0~1

percentX = percentX * 2 - 1; //-1~1
percentY = percentY * 2 - 1; //-1~1


var movRange = 2
mouseX = -percentX * movRange;
mouseY = percentY * movRange;

//console.log(percentX, percentY)

})


const r = 0.3
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

var uvs = [
    [0, 0],
    [1, 0],
    [1, 1],

    [0, 0],
    [0, 1],
    [1, 1],
]
//buffer is a big array combined into a single line, the following code defines the buffer using regl

var attributes = {
    position: regl.buffer(points),
    aColor: regl.buffer(colors),
    aUV: regl.buffer(uvs)
}

/////////////////////////////
var vertexShader = `
precision mediump float;
attribute vec3 position;
attribute vec3 aColor;
attribute vec2 aUV;

uniform float uTime;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

uniform vec3 uTranslate;

varying vec3 vColor;
varying vec2 vUV;

void main() {
    //create holder for position
    vec3 pos = position + uTranslate;
    // add the time to the 'x' only
    //pos.x += uTime;

    float movingRange = 0.2;
    // pos.x += sin(uTime) * movingRange;
    //pos.y += cos(uTime) * movingRange;

    //sin goes from -1 ~ 1

    gl_Position = uProjectionMatrix * uViewMatrix * vec4(pos, 1.0);
    vColor = aColor;
    vUV = aUV;
}`

//////////////////////////

var fragShader = `
precision mediump float;
varying vec3 vColor;
varying vec2 vUV;

uniform vec3 uTranslate;
void main(){
    vec2 center = vec2(0.5, 0.5);

    float d = distance(vUV, center);

    vec3 colorBg = vec3(1.0, 1.0, 1.0);
    vec3 colorDot = vec3(0.4, 0.5, 0.6);

    //float gradient = smoothstep(0.4, 0.5, d);

    gl_FragColor = vec4((uTranslate/5.0)* .5 + .5, 1.0);
}`

console.log('Attributes:', attributes)

const drawTriangles = regl({
uniforms: {
    uTime: regl.prop('time'),
    uProjectionMatrix: projectionMatrix,
    uViewMatrix: regl.prop('view'),
    uTranslate: regl.prop('translate')
},

    frag: fragShader,
    vert: vertexShader,
    attributes: attributes,

    depth:{
        enable: false
},

 blend: {
      enable: true,
      func: {
        srcRGB: 'src alpha',
        srcAlpha: 'src alpha',
        dstRGB: 'one minus src alpha',
        dstAlpha: 'one minus src alpha',
      },
    },
    count: 6
})



const clear = () => {
    regl.clear({
        color: [0, 0, 0, 0]
    })
}

function render(){

    currTime += 0.01

    var cameraRad = 10.0;
    var cameraX = Math.sin(currTime)*cameraRad;
    var cameraY = Math.cos(currTime)*cameraRad;

    mat4.lookAt(viewMatrix, [cameraX, cameraY, 10], [0, 0, 0], [0, 1, 0]); // to move the camera

    //console.log('Time :', currTime)
    //console.log('render')
    clear() //clearing the background each frame

    for (var i = 0; i < 5; i++){
        for (var j = 0; j < 5; j++){
            for (var k = 0; k < 5; k++) {
        var obj = {
            time: currTime,
            view: viewMatrix,
            translate: [i * (Math.cos(currTime) * 1), j * (Math.sin(currTime) * 1), k * (Math.sin(currTime) * 1)]
            }
            drawTriangles(obj)
            }
        }
    }


    window.requestAnimationFrame(render) //this is to clear the screen which is especially useful for animation on the screen
}

render()