import Particle from './particle.mjs'

const COLORS = ['#D98324', '#A40606', '#5A0002']

export default class Brick {
  constructor(x, y, w, h) {
    this.x = x
    this.y = y
    this.width = w
    this.height = h
    this.disabled = Math.random() < 0.2
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)]
    this.particles = []
  }
  state() {
    return this.disabled ? undefined : {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      color: this.color
    }
  }
  destroyed() {
    const p = this.particles
    this.particles = []
    return p
  }
  box() {
    return this.disabled ? undefined : {
      left: this.x,
      right: this.x + this.width,
      top: this.y,
      bottom: this.y + this.height
    }
  }
  onHit(dx, dy) {
    if (this.disabled) return
    this.disabled = true
    for (let y = this.y; y < this.y + this.height; y++) {
      for (let x = this.x; x < this.x + this.width; x++) {
        if (Math.random() < 0.07) {
          this.particles.push(new Particle(x, y, this.color, dx, dy))
        }
      }
    }
  }
}