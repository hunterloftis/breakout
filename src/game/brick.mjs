const COLORS = ['#D98324', '#A40606', '#5A0002']

export default class Brick {
  constructor(x, y, w, h) {
    this.x = x
    this.y = y
    this.width = w
    this.height = h
    this.disabled = Math.random() < 0.2
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)]
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