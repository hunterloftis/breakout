export default class Graphics {
  constructor(canvas) {
    this.canvas = canvas
    this.canvas.style.background = '#000000'
    this.canvas.style.cursor = 'none'
    this.ctx = canvas.getContext('2d')
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
  render(state, delta) {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.33)'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.save()
    if (state.intensity > 3) {
      this.ctx.translate(Math.random() * state.intensity, Math.random() * state.intensity)
    }
    state.bricks.forEach(b => this.renderBrick(b))
    this.renderBall(state.ball, delta)
    this.renderPaddle(state.paddle)
    state.particles.forEach(p => this.renderParticle(p))
    this.ctx.restore()
  }
  renderBrick(brick) {
    if (brick.disabled) return
    this.ctx.save()
    this.ctx.translate(brick.x, brick.y)
    this.ctx.beginPath()
    this.ctx.fillStyle = brick.color || '#ff0000'
    this.ctx.fillRect(1, 1, brick.width - 2, brick.height - 2)
    this.ctx.beginPath()
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.25)'
    this.ctx.fillRect(1, 1, brick.width - 2, 2)
    this.ctx.restore()
  }
  renderParticle(part) {
    this.ctx.fillStyle = part.color
    this.ctx.fillRect(part.x, part.y, 2, 2)
  }
  renderBall(ball, delta) {
    if (!ball) return
    this.ctx.save()
    this.ctx.translate(ball.x, ball.y)
    this.ctx.beginPath()
    this.ctx.strokeStyle = '#4C5B5C'
    this.ctx.lineWidth = 2
    this.ctx.moveTo(0, 0)
    const trail = ball.trail(delta)
    this.ctx.lineTo(trail.x, trail.y)
    this.ctx.stroke()
    this.ctx.fillStyle = '#ffffff'
    this.ctx.fillRect(-3, -3, 7, 7)
    this.ctx.restore()
  }
  renderPaddle(paddle) {
    this.ctx.save()
    this.ctx.translate(paddle.x, paddle.y)
    this.ctx.fillStyle = '#4C5B5C'
    this.ctx.fillRect(-paddle.width * 0.5, -paddle.height * 0.5, paddle.width, paddle.height)
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.25)'
    this.ctx.fillRect(-paddle.width * 0.5, -paddle.height * 0.5, paddle.width, 2)
    this.ctx.restore()
  }
}