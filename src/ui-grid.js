import { clamp, html, vec2 } from './deps.js'
import { Bezier }        from 'https://cdn.skypack.dev/bezier-js'
import { CodeExample }   from './code-example.js'
import handleInteraction from './handle-interaction.js'



// adapted from https://pomax.github.io/bezierjs/#get
function compute (out, t, points) {
    // shortcuts
    if (t === 0)
        return vec2.copy(out, points[0])

    if (t === 1)
        return vec2.copy(out, points[3])

    const mt = 1 - t
    const mt2 = mt * mt
    const t2 = t * t

    // order 3 (cubic curve)
    const a = mt2 * mt
    const b = mt2 * t * 3
    const c = mt * t2 * 3
    const d = t * t2

    const p = points

    vec2.set(out,
             a * p[0][0] + b * p[1][0] + c * p[2][0] + d * p[3][0],
             a * p[0][1] + b * p[1][1] + c * p[2][1] + d * p[3][1])
}


function init (options={}) {
    const curve = new Bezier(12,143 , 90,51 , 135,92 , 145,139)
    window.curve = curve
    return {
        curve,
        code: undefined,
        interactionHandler: undefined,
        canvas: undefined,
        context: undefined,
        canvasWidth: 0,
        canvasHeight: 0,

        hover: [ 0, 0 ],

        curveLength: 0,
        boundingBox: {
            width: 0,
            height: 0
        }
    }
}


function _drawCanvas (model) {

    // reset transform to identity matrix
    //model.context.setTransform(1, 0, 0, 1, 0, 0)

    model.context.clearRect(
        0,
        0,
        model.canvasWidth,
        model.canvasHeight
    )

    model.context.mozImageSmoothingEnabled = false
    model.context.webkitImageSmoothingEnabled = false
    model.context.msImageSmoothingEnabled = false
    model.context.imageSmoothingEnabled = false

    model.context.strokeStyle = 'rgba(0,0,0,0.1)'
    model.context.lineWidth = 1 //1 / window.devicePixelRatio

    model.context.beginPath()

    let y = 0
    while (y <= model.canvasHeight) {
        model.context.moveTo(0.5, y + 0.5)
        model.context.lineTo(model.canvasWidth + 0.5, y + 0.5)
        y += 8
    }

    let x = 0
    while (x <= model.canvasWidth) {
        model.context.moveTo(x + 0.5, 0.5)
        model.context.lineTo(x + 0.5, model.canvasHeight + 0.5)
        x += 8
    }

    model.context.stroke()

    model.code.draw()
}


function view (model, update) {

    const _mousemove = function (ev) {
        model.hover[0] = Math.round(ev.offsetX)
        model.hover[1] = Math.round(ev.offsetY)
        update()
    }


    const _insertHook = function (vnode) {
        model.canvas = vnode.elm
        model.context = model.canvas.getContext('2d')

        model.code = new CodeExample(model.canvas)

        const draw = function () {
          this.drawSkeleton(model.curve)
          this.drawCurve(model.curve)
          //const steps = 16
          //const LUT = curve.getLUT(steps)
          //LUT.forEach(p => this.drawCircle(p,2))

          /*
          const out = [ 0, 0 ]
          const points = model.curve.points.map((p) => [ p.x, p.y ])
          compute(out, 0.5, points)

          this.setColor('deeppink')
          this.drawCircle({ x: out[0], y: out[1] }, 4)
          */
        }

        model.code.draw = draw.bind(model.code)

        const _updateCurveDimensions = function (model) {
            model.curveLength = model.curve.length()
            const bbox = model.curve.bbox()
            //console.log(bbox)
            model.boundingBox.width = Math.round(bbox.x.size)
            model.boundingBox.height = Math.round(bbox.y.size)
        }

        model.interactionHandler = handleInteraction(model.canvas, model.curve).onupdate = evt => {
            model.code.reset()
            _updateCurveDimensions(model)
            _drawCanvas(model)
            update()
        }

        _updateCurveDimensions(model)

        const _draw = function () {
            _drawCanvas(model)
            requestAnimationFrame(_draw)
        }

        requestAnimationFrame(_draw)
    }

    const width = model.canvasWidth
    const height = model.canvasHeight

    return html`<canvas width=${width}
                        height=${height}
                        style="width: ${width}px; height: ${height}px;"
                        @on:mousemove=${_mousemove}
                        @hook:insert=${_insertHook}></canvas>`
}


export default { init, view }
