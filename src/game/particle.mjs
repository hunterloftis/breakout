const GRAVITY = 10

export default class Particle {
  constructor(x, y, color, dx, dy) {
    this.x = this.x1 = x
    this.y = this.y1 = y
    this.color = color
    this.x += dx * 2 + Math.random() * 2 - 1
    this.y += dy * 3 + Math.random() * 2 - 1
  }
  state() {
    return {
      x: this.x,
      y: this.y,
      color: this.color
    }
  }
  update(delta) {
    const secs = delta / 1000
    const vx = this.x - this.x1
    const vy = this.y - this.y1
    this.x1 = this.x
    this.y1 = this.y
    this.x += vx
    this.y += vy
    this.y += GRAVITY * secs
    return this.y < 800 && Math.random() > 0.08
  }
}