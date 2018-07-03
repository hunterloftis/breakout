const MAX_DELTA = 64

export default class Clock {
  constructor(tick = 16) {
    this.tick = tick
    this.started = 0
    this.frame = this.frame.bind(this)
    this._fixedUpdate = this._update = () => { }
  }
  start() {
    this.started = this.time = performance.now()
    requestAnimationFrame(this.frame)
  }
  stop() {
    this.started = 0
  }
  frame() {
    if (!this.started) return

    const now = performance.now()
    let delta = now - this.time
    if (delta > MAX_DELTA) {
      this.time = now - MAX_DELTA
      delta = MAX_DELTA
    }
    while (this.time + this.tick < now) {
      this.time += this.tick
      this._fixedUpdate(this.tick, this.time - this.started)
    }
    this._update(delta, now - this.started)
    requestAnimationFrame(this.frame)
  }
  fixedUpdate(fn) {
    this._fixedUpdate = fn
    return this
  }
  update(fn) {
    this._update = fn
    return this
  }
}
