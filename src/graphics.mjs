export default class Graphics {
  constructor(canvas) {
    this.canvas = canvas
    this.canvas.style.background = '#000000'
    this.canvas.style.cursor = 'none'
    this.ctx = canvas.getContext('2d')
  }
  render(state) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.renderPaddle(state.paddle)
  }
  renderPaddle(paddle) {
    this.ctx.save()
    this.ctx.translate(paddle.x, paddle.y)
    this.ctx.fillStyle = '#ffffff'
    this.ctx.fillRect(-paddle.width * 0.5, -paddle.height * 0.5, paddle.width, paddle.height)
    this.ctx.restore()
  }
}