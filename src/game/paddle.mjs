export default class Paddle {
  constructor(x, y, width = 90, height = 10) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
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
      bottom: this.y + this.height * 0.5
    }
  }
}