export default class Clock {
  constructor(tick = 16) {
    this.tick = tick
    this.start = performance.now()
    this.time = this.start
    this.frame = this.frame.bind(this)
    this._fixedUpdate = this._update = () => { }
    requestAnimationFrame(this.frame)
  }
  frame() {
    const now = performance.now()
    const delta = now - this.time
    while (this.time + this.tick < now) {
      this.time += this.tick
      this._fixedUpdate(this.tick, this.time - this.start)
    }
    this._update(delta, now - this.start)
    requestAnimationFrame(this.frame)
  }
  fixedUpdate(fn) {
    this._fixedUpdate = fn
  }
  update(fn) {
    this._update = fn
  }
}
