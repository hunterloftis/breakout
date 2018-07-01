export default class Game {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.paddle = {
      x: width * 0.5,
      y: this.height - 10,
      width: 50,
      height: 5
    }
  }
  moveTo(x) {
    const min = this.paddle.width * 0.5
    const max = this.width - this.paddle.width * 0.5
    this.paddle.x = Math.max(min, Math.min(max, x))
  }
  state() {
    return {
      paddle: this.paddle
    }
  }
}