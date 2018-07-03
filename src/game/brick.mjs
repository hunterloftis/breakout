import Particle from './particle.mjs'

export default class Brick {
  constructor(x, y, w, h) {
    this.x = x
    this.y = y
    this.width = w
    this.height = h
    this.lives = 2 //Math.floor(Math.random() * 4)
    this.particles = []
  }
  state() {
    return this.disabled ? undefined : {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      lives: this.lives,
    }
  }
  destroyed() {
    const p = this.particles
    this.particles = []
    return p
  }
  box() {
    return this.lives < 1 ? undefined : {
      left: this.x,
      right: this.x + this.width,
      top: this.y,
      bottom: this.y + this.height,
      solid: true
    }
  }
  onHit(dx, dy) {
    if (this.lives < 1) return
    this.lives--
    if (this.lives > 0) return 1
    for (let y = this.y; y < this.y + this.height; y++) {
      for (let x = this.x; x < this.x + this.width; x++) {
        if (Math.random() < 0.07) {
          this.particles.push(new Particle(x, y, this.color, dx, dy))
        }
      }
    }
    return 5
  }
}