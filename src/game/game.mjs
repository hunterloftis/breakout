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
  movePaddle(x) {
    this.paddle.moveTo(x, this.paddle.y, 0, this.width)
  }
  fixedUpdate(tick, time) {
    if (!this.ball) {
      this.ball = new Ball(this.width * 0.1, this.width * 0.9, this.paddle.y - this.paddle.height * 3)
    }
    const ball = this.ball.move(tick, this, this.paddle, this.bricks)
    if (ball) this.intensity += this.ball.intensity
    else this.ball = undefined

    const particles = [].concat(...this.bricks.map(b => b.destroyed()).filter(x => x))
    this.particles.push(...particles)
  }
  update(delta, time) {
    this.intensity = Math.max(0, this.intensity * 0.95)
    this.particles = this.particles.filter(p => p.update(delta))
  }
  box() {
    return {
      left: 0,
      right: this.width,
      top: 0,
      bottom: this.height,
      solid: false
    }
  }
  state() {
    return {
      paddle: this.paddle.state(),
      ball: this.ball && this.ball.state(),
      bricks: this.bricks.map(b => b.state()),
      intensity: this.intensity,
      particles: this.particles.map(p => p.state()),
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