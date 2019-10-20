const regl = require('regl')()
const strVert = require('./shaders/shaderVertex.js');
const strFrag = require('./shaders/shaderFrag.js');
const loadObj = require('./utils/loadObj.js')

const glm = require('gl-matrix')
var mat4 = glm.mat4

var projectionMatrix = mat4.create()
var fov = 75 * Math.PI / 180
var aspect = window.innerWidth / window.innerHeight
mat4.perspective(projectionMatrix, fov, aspect, 0.01, 1000.0)

var viewMatrix = mat4.create()
mat4.lookAt(viewMatrix, [0, 0, 100], [0, 0, 0], [0, 1, 0])

var drawWheel

var mouseX = 0; var mouseY = 0
// camera control
window.addEventListener('mousemove', function (e) {
  var x = e.clientX / window.innerWidth
  var y = e.clientY / window.innerHeight

  var movingRange = 20.0
  mouseX = -(x - 0.5) * movingRange
  mouseY = (y) * movingRange
})

loadObj('./assets/stem.obj', function (obj) {
  console.log(obj)
  // create the attributes
  var attributes = {
    aPosition: regl.buffer(obj.positions),
    aUV: regl.buffer(obj.uvs)
  }
  // create our draw call
  drawWheel = regl({
    uniforms: {
      uTime: regl.prop('time'),
      uProjectionMatrix: regl.prop('projection'),
      uViewMatrix: regl.prop('view'),
      uTranslate: regl.prop('translate'),
      uColor: regl.prop('color')
    },
    vert: strVert,
    frag: strFrag,
    attributes: attributes,
    count: obj.count
  })
})

var currTime = 0

const clear = () => {
  regl.clear({
    color: [0.8, 0.8, 0.8, 1]
  })
}

var gap = 5

function render () {
  currTime += 0.01

  mat4.lookAt(viewMatrix, [mouseX, mouseY, 30], [0, 0, 0], [0, 1, 0])
console.log(drawWheel)
  clear()
  if (drawWheel != undefined) {
    var num = 20
    const start = num / 2 * 2 - 1

    for (var i = 0; i < num; i++) {
      for (var j = 0; j < num; j++) {
       // for (var k = 0; k < num; k++) {
          // create object for uniforms
          var obj = {
            time: currTime,
            projection: projectionMatrix,
            view: viewMatrix,
            translate: [-start + i * gap, -10, -start + j * gap],
            color: [i / num, j / num, j / num]
          }

          drawWheel(obj)
        //}
      }
    }
  }

  window.requestAnimationFrame(render)
}

render()