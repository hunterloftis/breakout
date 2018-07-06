const RESIZE_TIME = 250

export default class Paddle {
  constructor(x, y, width = 100, height = 20) {
    this.x = x
    this.y = y
    this.width = this.targetWidth = width
    this.height = height
  }
  state() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    }
  }
  moveTo(x, y, minX, maxX) {
    const min = minX + this.width * 0.5
    const max = maxX - this.width * 0.5
    this.x = Math.max(min, Math.min(max, x))
  }
  box() {
    return {
      left: this.x - this.width * 0.5,
      right: this.x + this.width * 0.5,
      top: this.y - this.height * 0.5,
      bottom: this.y + this.height * 0.5,
      solid: true
    }
  }
  fixedUpdate(tick, time) {
    this.width += (this.targetWidth - this.width) * Math.min(1, tick / RESIZE_TIME)
  }
  resize(w) {
    this.targetWidth = w
  }
}