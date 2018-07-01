import Paddle from './paddle.mjs'
import Ball from './ball.mjs'

export default class Game {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.paddle = new Paddle(width * 0.5, this.height - 30)
    this.ball = undefined
  }
  moveTo(x) {
    this.paddle.moveTo(x, this.paddle.y, 0, this.width)
  }
  fixedUpdate(tick, time) {
    if (!this.ball) {
      this.ball = new Ball(this.width * 0.1, this.width * 0.9, this.paddle.y - this.paddle.height * 3)
    }
    this.ball.integrate(tick)
    this.ball.constrainIn(this.box())
    this.ball.constrainOut(this.paddle.box())
  }
  box() {
    return { left: 0, right: this.width, top: 0, bottom: this.height }
  }
  state() {
    return {
      paddle: this.paddle,
      ball: this.ball
    }
  }
}