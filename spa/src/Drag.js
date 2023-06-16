import _ from 'lodash'
import util from "./util";
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
class Drag {
    constructor(dragElm, paras) {
        this.dragElm = document.querySelector(dragElm)
        this.handleElm = document.querySelector(paras.handle)
        this.containmentElm = document.querySelector(paras.containment)
        // console.log(`this.dragElm=`, this.dragElm, 'this.handleElm=', this.handleElm, 'this.containmentElm=', this.containmentElm)
        this.onClick = paras.onClick
        _.bindAll(this, ['setMaxSize', 'setup', 'dragMouseDown', 'registerEvent', 
                        'elementDrag', 'closeDragElement', 'dispose'])
        this.setMaxSize()
        this.checkEvent()
        this.setup()
        window.addEventListener("resize", this.setMaxSize);
    }
    checkEvent(){
        // https://css-tricks.com/interaction-media-features-and-their-potential-for-incorrect-assumptions/
        if ( window.PointerEvent ) {
            // Pointer Events
            this.activeEvents = [ 'pointerdown', 'pointermove', 'pointerup', 'pointercancel' ];
        }else if ( util.isTouchscreen() ) {
            // HACK prefer Touch Events as you can preventDefault on touchstart to
            // disable scroll in iOS & mobile Chrome metafizzy/flickity#1177
            this.activeEvents = [ 'touchstart', 'touchmove', 'touchend', 'touchcancel' ];
        } else {
            // mouse events
            this.activeEvents = [ 'mousedown', 'mousemove', 'mouseup' ];
        }
        // console.log(this.activeEvents)
    }
    setMaxSize(){
        this.minTop = this.containmentElm.offsetTop
        this.maxTop = this.containmentElm.offsetHeight - this.dragElm.offsetHeight + this.containmentElm.offsetTop
        this.minLeft = this.containmentElm.offsetLeft
        this.maxLeft = this.containmentElm.offsetWidth - this.dragElm.offsetWidth + this.containmentElm.offsetLeft
        // console.log(`maxTop=${maxTop};maxLeft=${maxLeft}`)
    }
    setup(){
        // console.log('this.activeEvents=', this.activeEvents)
        this.pos1 = this.pos2 = this.pos3 = this.pos4 = 0
        const el = this.handleElm ? this.handleElm : this.dragElm
        this.registerEvent(el, this.activeEvents[0], this.dragMouseDown) 
    }
    registerEvent(elm, e, handler, ops={passive: false, capture: false}){
        elm.removeEventListener(e, handler)
        elm.addEventListener(e, handler, ops)   
    }
    dragMouseDown(e) {
        // e.preventDefault()
        e.stopPropagation()
        // get the mouse cursor position at startup:
        this.pos3 = e.clientX || e.changedTouches[0].clientX ;
        this.pos4 = e.clientY || e.changedTouches[0].clientY ;
        // console.log('register closeDragElement')
        this.registerEvent(document, this.activeEvents[2], this.closeDragElement)  
        // call a function whenever the cursor moves:
        this.registerEvent(document, this.activeEvents[1], this.elementDrag) 
        this.drag = false
    }

    elementDrag(e) {
        if( !(e.clientX || e.changedTouches) ) return
        e.preventDefault()
        e.stopPropagation()
        // calculate the new cursor position:
        const x = e.clientX || e.changedTouches[0].clientX;
        const y = e.clientY || e.changedTouches[0].clientY;
        // console.log(e)
        this.pos1 = this.pos3 - x;
        this.pos2 = this.pos4 - y;
        this.pos3 = x;
        this.pos4 = y;
        // set the element's new position:
        this.dragElm.style.top = clamp(this.dragElm.offsetTop - this.pos2, this.minTop, this.maxTop) + "px";
        this.dragElm.style.left = clamp(this.dragElm.offsetLeft - this.pos1, this.minLeft, this.maxLeft) + "px";
        this.drag = true
    }
    closeDragElement() {
        /* stop moving when mouse button is released:*/      
        document.removeEventListener(this.activeEvents[1], this.elementDrag)
        document.removeEventListener(this.activeEvents[2], this.closeDragElement)
        // console.log(`this.drag=${this.drag}; this.onClick=`, this.onClick)
        if( (!this.drag) && typeof this.onClick === "function" ){
            this.onClick()
            // alert(`isTouchscreen=${util.isTouchscreen()}`)
        } 
    }
    dispose(){
        window.removeEventListener("resize", this.setMaxSize)
        document.removeEventListener(this.activeEvents[1], this.elementDrag)
        document.removeEventListener(this.activeEvents[2], this.closeDragElement)
        const el = this.handleElm ? this.handleElm : this.dragElm
        el.removeEventListener(this.activeEvents[0], this.dragMouseDown)
    }
}

export default Drag;