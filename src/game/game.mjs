import Paddle from './paddle.mjs'
import Ball from './ball.mjs'
import Brick from './brick.mjs'

const EVENTS = {
  bounce: false,
  smash: false,
  death: false
}

export default class Game {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.paddle = new Paddle(width * 0.5, this.height - 30)
    this.ball = undefined
    this.bricks = bricks(40, height * 0.1, width - 40, height * 0.5, 16, 8)
    this.intensity = 0
    this.particles = []
    this.events = { ...EVENTS }
    this.lives = 3
  }
  movePaddle(x) {
    this.paddle.moveTo(x, this.paddle.y, 0, this.width)
  }
  paddleWidth() {
    return this.paddle.width
  }
  die() {
    this.ball = undefined
    this.lives--
    if (this.lives < 1) {
      this.events.death = true
    }
  }
  fixedUpdate(tick, time) {
    if (this.lives === 0) {
      if (this.bricks.length && Math.random() < 0.5) {
        this.bricks[0].onHit(0, 0, 10)
      }
    }
    else if (this.bricks.length === 0) {
      this.ball = undefined
    }
    else {
      if (!this.ball) {
        this.ball = new Ball(this.width * 0.1, this.width * 0.9, this.paddle.y - this.paddle.height * 3)
      }
      const [ball, bounce] = this.ball.move(tick, this, this.paddle, this.bricks)
      if (ball) {
        this.intensity += this.ball.intensity
      }
      else {
        this.die()
      }
      this.events.bounce = bounce
    }

    const particles = [].concat(...this.bricks.map(b => b.destroy()))
    this.particles.push(...particles)
    this.bricks = this.bricks.filter(b => b.alive())
    if (particles.length) {
      this.events.smash = true
    }
  }
  update(delta, time) {
    this.intensity = Math.max(0, this.intensity * 0.95)
    this.particles = this.particles.filter(p => p.update(delta))
  }
  flushEvents() {
    const e = this.events
    this.events = { ...EVENTS }
    return e
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
      lives: this.lives,
    }
  }
}

function bricks(left, top, right, bottom, cols, rows) {
  const b = []
  const width = right - left
  const height = bottom - top
  const dx = width / cols
  const dy = height / rows
  for (let y = 0; y < rows; y += 2) {
    for (let x = (y / 2 % 2); x < (cols - y / 2 % 2); x++) {
      b.push(new Brick(left + x * dx, top + y * dy, dx, dy))
    }
  }
  return b
}