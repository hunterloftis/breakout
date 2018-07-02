import Paddle from './paddle.mjs'
import Ball from './ball.mjs'
import Brick from './brick.mjs'

export default class Game {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.paddle = new Paddle(width * 0.5, this.height - 30)
    this.ball = undefined
    this.bricks = bricks(0, height * 0.1, width, height * 0.5, 20, 7)
  }
  moveTo(x) {
    this.paddle.moveTo(x, this.paddle.y, 0, this.width)
  }
  fixedUpdate(tick, time) {
    if (!this.ball) {
      this.ball = new Ball(this.width * 0.1, this.width * 0.9, this.paddle.y - this.paddle.height * 3)
    }
    this.ball.move(tick, this, this.paddle, this.bricks)
    if (this.ball.destroyed) this.ball = undefined
  }
  box() {
    return { left: 0, right: this.width, top: 0, bottom: this.height }
  }
  state() {
    return {
      paddle: this.paddle,
      ball: this.ball,
      bricks: this.bricks
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