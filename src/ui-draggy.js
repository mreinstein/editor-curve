import { clamp, html }  from './deps.js'


function init (options={}) {
    return { width: options.width || 0, maxWidth: options.maxWidth || 100 }
}


function view (model, update) {
    const _down = function () {
    	document.addEventListener('mousemove', _move)
    	document.addEventListener('mouseup', _up)
    }

    const _up = function (ev) {
    	document.removeEventListener('mousemove', _move)
    	document.removeEventListener('mouseup', _up)
    }

    const _move = function (ev) {
    	model.width = clamp(model.width - ev.movementX, 0, Infinity)
    	update()
    }

    return html`<button class="draggy" @on:mousedown=${_down}>⁞</button>`
}


export default { init, view }
