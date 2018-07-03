export default class Mouse {
  constructor(canvas, margin = 0) {
    this.x = canvas.width * 0.5
    this.y = canvas.height * 0.5
    this._lock = () => { }
    this._unlock = () => { }

    canvas.addEventListener('click', () => canvas.requestPointerLock())

    document.addEventListener('pointerlockchange', () => {
      if (document.pointerLockElement === canvas) this._lock()
      else this._unlock()
    })
    document.addEventListener('mousemove', e => {
      this.x = Math.max(margin, Math.min(canvas.width - margin, this.x + e.movementX))
      this.y = Math.max(margin, Math.min(canvas.height - margin, this.y + e.movementY))
    })
  }
  lock(fn) {
    this._lock = fn
    return this
  }
  unlock(fn) {
    this._unlock = fn
    return this
  }
}
