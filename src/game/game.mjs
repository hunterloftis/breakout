import Paddle from './paddle.mjs'
import Ball from './ball.mjs'
import Brick from './brick.mjs'

export default class Game {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.paddle = new Paddle(width * 0.5, this.height - 30)
    this.ball = undefined
    this.bricks = bricks(40, height * 0.1, width - 40, height * 0.5, 16, 8)
    this.intensity = 0
    this.particles = []
  }
  moveTo(x) {
    this.paddle.moveTo(x, this.paddle.y, 0, this.width)
  }
  fixedUpdate(tick, time) {
    if (!this.ball) {
      this.ball = new Ball(this.width * 0.1, this.width * 0.9, this.paddle.y - this.paddle.height * 3)
    }
    const [intensity, particles] = this.ball.move(tick, this, this.paddle, this.bricks)
    this.intensity += intensity
    this.particles.push(...particles)
    if (this.ball.destroyed) this.ball = undefined
  }
  update(delta, time) {
    this.intensity = Math.max(0, this.intensity * 0.95)
    this.particles = this.particles.filter(p => p.update(delta))
  }
  box() {
    return { left: 0, right: this.width, top: 0, bottom: this.height }
  }
  state() {
    return {
      paddle: this.paddle,
      ball: this.ball,
      bricks: this.bricks,
      intensity: this.intensity,
      particles: this.particles,
    }
  }
}

function bricks(left, top, right, bottom, cols, rows) {
  const b = []
  const width = right - left
  const height = bottom - top
  const dx = width / cols
  const dy = height / rows
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      b.push(new Brick(left + x * dx, top + y * dy, dx, dy))
    }
  }
  return b
}