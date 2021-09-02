import { html }  from './deps.js'


function init (options={}) {
    return { }
}


function view (model, update) {
 
    return html`<div class="footer">
        <span style="width: 70px;">
        	<span style="color: #1ed36f">x:</span> <span style="color: white">${model.grid.hover[0]}</span>
        	<span style="color: #1ed36f">y:</span> <span style="color: white">${model.grid.hover[1]}</span>
        </span>
    </div>`
}


export default { init, view }
