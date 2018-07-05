const MAX_DELTA = 64

export default class Clock {
  constructor(tick = 16) {
    this.tick = tick
    this.clockTime = 0
    this.realTime = 0
    this.frame = this.frame.bind(this)
    this._fixedUpdate = this._update = () => { }
  }
  start() {
    this.realTime = performance.now()
    requestAnimationFrame(this.frame)
  }
  stop() {
    this.realTime = 0
  }
  frame() {
    if (!this.realTime) return

    const now = performance.now()
    const delta = Math.min(now - this.realTime, MAX_DELTA)
    this.realTime = now - delta

    while (this.realTime + this.tick <= now) {
      this.realTime += this.tick
      this.clockTime += this.tick
      this._fixedUpdate(this.tick, this.clockTime)
    }
    this._update(delta, this.clockTime)
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
