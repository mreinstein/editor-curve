import draggy     from './ui-draggy.js'
import footer     from './ui-footer.js'
import grid       from './ui-grid.js'
import { html }   from './deps.js'


function init (options={}) {
    return {
        elm: undefined,

        grid: grid.init(),

        rightPanel: draggy.init({
            width: 380,
            maxWidth: 600
        })
    }
}


function view (model, update) {
    const _insertHook = function (vnode) {
        model.elm = vnode.elm

        const o = new ResizeObserver(function (/*entries*/) {
            model.grid.canvasWidth = model.elm.clientWidth
            model.grid.canvasHeight = model.elm.clientHeight
            update()
        })

        setTimeout(function () {
            o.observe(model.elm)
        }, 0)

        // on Android, if you hold your finger on an image for about a second,
        // it'll open a prompt with an option to save the image.
        // preventing the contextment event stops this
        document.body.oncontextmenu = function (ev) {
            ev.preventDefault()
        }
    }

    const _save = function () {
        const points = model.grid.curve.points.map((p) => [ p.x, p.y ])
        alert(JSON.stringify({
            length: parseFloat(model.grid.curveLength.toFixed(2)),
            boundingBox: {
                width: model.grid.boundingBox.width,
                height: model.grid.boundingBox.height
            },
            points }))
    }

    const _load = function () {
        const rawText = prompt('enter curve data')
        try {
            const curve = JSON.parse(rawText)
            curve.points.forEach((p, idx) => {
                model.grid.curve.points[idx].x = p[0]
                model.grid.curve.points[idx].y = p[1]
            })
            // TODO: model.curve = 
            model.grid.curve.update()
            model.grid.interactionHandler();
            
            update()
        } catch (er) {

        }
        
    }

    const _changePoint = function (p, dim, val) {
        model.grid.curve.points[p][dim] = parseInt(val, 10)
        model.grid.curve.update()
        model.grid.interactionHandler();
    }

    return html`<div class="outer-container" style="grid-template-columns: 2px 1fr 10px ${model.rightPanel.width}px">
        <div class="header">
          <span>Bezier Cubic Curve Editor</span>
          <div class="responsive-controls">
            <button class="editor-button" @on:click=${_load}>load</button>
            <button class="editor-button" @on:click=${_save}>save</button>
          </div>
        </div>

        <div class="editor-left"></div>

        <div class="editor-main"
             @hook:insert=${_insertHook}>${grid.view(model.grid, update)}</div>

        <div class="editor-right-draggy">${draggy.view(model.rightPanel, update)}</div>

        <div class="editor-right">
            <div class="panel">
                <div class="panel-header"
                     style="align-items: center;">
                    <span class="expando"></span>
                    <img src="./assets/layer.png" style="padding-right: 6px;"/>
                    Start Point
                </div>
                <div style="padding: 17px;">
                   x: <input type="number"
                             @on:change=${(ev) => _changePoint(0, 'x', ev.target.value)}
                             value="${model.grid.curve.points[0].x}"/>

                   y: <input type="number"
                             @on:change=${(ev) => _changePoint(0, 'y', ev.target.value)}
                             value="${model.grid.curve.points[0].y}"/>
                </div>
            </div>

            <div class="panel">
                <div class="panel-header"
                     style="align-items: center;">
                    <span class="expando"></span>
                    <img src="./assets/layer.png" style="padding-right: 6px;"/>
                    End Point
                </div>
                <div style="padding: 17px;">
                   x: <input type="number"
                             @on:change=${(ev) => _changePoint(3, 'x', ev.target.value)}
                             value="${model.grid.curve.points[3].x}"/>

                   y: <input type="number"
                             @on:change=${(ev) => _changePoint(3, 'y', ev.target.value)}
                             value="${model.grid.curve.points[3].y}"/>
                </div>
            </div>

            <div class="panel">
                <div class="panel-header"
                     style="align-items: center;">
                    <span class="expando"></span>
                    <img src="./assets/layer.png" style="padding-right: 6px;"/>
                    Dimensions
                </div>
                <div style="padding: 17px;">
                   width: ${model.grid.boundingBox.width}px
                   <br/>
                   height: ${model.grid.boundingBox.height}px
                   <br/><br/>
                   curve length: ${Math.round(model.grid.curveLength)}px
                </div>
            </div>

        </div>

        ${footer.view(model, update)}
      </div>`
}


export default { init, view }
