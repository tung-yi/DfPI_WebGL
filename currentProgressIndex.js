const regl = require('regl')()


const strVertex = require('./shaders/shaderVertex.js')
console.log('strVertex', strVertex)

const strFrag = require('./shaders/shaderFrag.js')
console.log('strFrag', strFrag)

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


var movRange = 8
mouseX = -percentX * movRange;
mouseY = percentY * movRange;

//console.log(percentX, percentY)

})


const r = 0.45
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


//vertexShader deleted and created in a new tab

//fragShader deleted and created in a new tab

console.log('Attributes:', attributes)

const drawTriangles = regl({
uniforms: {
    uTime: regl.prop('time'),
    uProjectionMatrix: projectionMatrix,
    uViewMatrix: regl.prop('view'),
    uTranslate: regl.prop('translate')
},

    frag: strFrag,
    vert: strVertex,
    attributes: attributes,

    depth:{
        enable: false,
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
        color: [0, 0, 0, 1]
    })
}

function render(){

    currTime += 0.01

    var cameraRad = 5;
    var cameraX = Math.sin(currTime)*cameraRad;
    var cameraY = Math.cos(currTime)*cameraRad;
    var cameraZ = Math.sin(currTime)*cameraRad;

    mat4.lookAt(viewMatrix, [mouseX, mouseY, 30], [0, 0, 0], [0, 1, 0]); // to move the camera

    clear() //clearing the background each frame

var numb = 100;
var start =-numb/2;

    for (var i = 0; i < numb; i++){
        for (var j = 0; j < numb; j++){
            //for (var k = 0; k < 10; k++) {

                var x = start + i;
                var y = start + j;
        var obj = {
            time: currTime,
            view: viewMatrix,
            translate: [x, y, 1]
            }
            drawTriangles(obj)
            // }
        }
    }


    window.requestAnimationFrame(render) //this is to clear the screen which is especially useful for animation on the screen
}

render()