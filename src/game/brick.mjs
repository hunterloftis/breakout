export default class Brick {
  constructor(x, y, w, h) {
    this.x = x
    this.y = y
    this.width = w
    this.height = h
    this.disabled = false
  }
  box() {
    if (this.disabled) {
      return undefined
    }
    return {
      left: this.x,
      right: this.x + this.width,
      top: this.y,
      bottom: this.y + this.height
    }
  }
  onHit() {
    this.disabled = true
  }
}