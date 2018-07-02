export default class Graphics {
  constructor(canvas) {
    this.canvas = canvas
    this.canvas.style.background = '#000000'
    this.canvas.style.cursor = 'none'
    this.ctx = canvas.getContext('2d')
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
  render(state) {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.33)'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    state.bricks.forEach(b => this.renderBrick(b))
    this.renderBall(state.ball)
    this.renderPaddle(state.paddle)
  }
  renderBrick(brick) {
    if (brick.disabled) return
    this.ctx.save()
    this.ctx.translate(brick.x, brick.y)
    this.ctx.fillStyle = '#ff0000'
    this.ctx.lineWidth = 2
    this.ctx.strokeStyle = '#ffffff'
    this.ctx.beginPath()
    this.ctx.rect(0, 0, brick.width, brick.height)
    this.ctx.fill()
    this.ctx.stroke()
    this.ctx.restore()
  }
  renderBall(ball) {
    if (!ball) return
    this.ctx.save()
    this.ctx.translate(ball.x, ball.y)
    this.ctx.fillStyle = '#00ffff'
    this.ctx.fillRect(-3, -3, 7, 7)
    this.ctx.restore()
  }
  renderPaddle(paddle) {
    this.ctx.save()
    this.ctx.translate(paddle.x, paddle.y)
    this.ctx.fillStyle = '#ffffff'
    this.ctx.fillRect(-paddle.width * 0.5, -paddle.height * 0.5, paddle.width, paddle.height)
    this.ctx.restore()
  }
}