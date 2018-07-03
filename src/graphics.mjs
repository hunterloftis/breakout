export default class Graphics {
  constructor(canvas) {
    this.canvas = canvas
    this.canvas.style.background = '#000000'
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
    state.bricks.forEach(b => this.renderBrick(b, state.ball))
    this.renderBall(state.ball, delta)
    this.renderPaddle(state.paddle, state.ball)
    state.particles.forEach(p => this.renderParticle(p))
    this.ctx.restore()
  }
  renderBrick(brick, ball) {
    if (!brick) return
    if (brick.lives < 1) return
    const COLORS = ['#A40606', '#D98324']
    // const COLORS = ['#5A0002', '#A40606', '#D98324']

    this.ctx.save()
    this.ctx.translate(brick.x, brick.y)
    this.ctx.beginPath()
    this.ctx.fillStyle = COLORS[brick.lives - 1] || '#ff0000'
    this.ctx.fillRect(1, 1, brick.width - 2, brick.height - 2)
    this.ctx.beginPath()
    this.ctx.fillStyle = `rgba(255, 255, 255, 0.2)`
    this.ctx.fillRect(3, 1, brick.width - 6, 2)

    if (ball) {
      this.ctx.beginPath()
      if (ball.x < brick.x + brick.width) {
        const dx = ball.x - brick.x
        const dy = ball.y - (brick.y + brick.height * 0.5)
        const d = dx * dx + dy * dy
        const o = 0.4 * Math.max(0, Math.min(1, 50000 / d))
        this.ctx.fillStyle = `rgba(255, 255, 255, ${o})`
        this.ctx.fillRect(1, 3, 2, brick.height - 6)
      }
      if (ball.x > brick.x) {
        const dx = ball.x - brick.x + brick.width
        const dy = ball.y - (brick.y + brick.height * 0.5)
        const d = dx * dx + dy * dy
        const o = 0.4 * Math.max(0, Math.min(1, 50000 / d))
        this.ctx.fillStyle = `rgba(255, 255, 255, ${o})`
        this.ctx.fillRect(brick.width - 4, 3, 2, brick.height - 6)
      }
      this.ctx.beginPath()
      if (ball.y < brick.y + brick.height) {
        const dx = ball.x - (brick.x + brick.width * 0.5)
        const dy = ball.y - brick.y
        const d = dx * dx + dy * dy
        const o = 0.4 * Math.max(0, Math.min(1, 50000 / d))
        this.ctx.fillStyle = `rgba(255, 255, 255, ${o})`
        this.ctx.fillRect(3, 1, brick.width - 6, 2)
      }
      if (ball.y > brick.y) {
        const dx = ball.x - (brick.x + brick.width * 0.5)
        const dy = ball.y - brick.y + brick.height
        const d = dx * dx + dy * dy
        const o = 0.4 * Math.max(0, Math.min(1, 50000 / d))
        this.ctx.fillStyle = `rgba(255, 255, 255, ${o})`
        this.ctx.fillRect(3, brick.height - 4, brick.width - 6, 2)
      }
      this.ctx.fill()
    }
    this.ctx.restore()
  }
  renderParticle(part) {
    this.ctx.fillStyle = '#A40606' // part.color
    this.ctx.fillRect(part.x - 1, part.y - 1, 3, 3)
  }
  renderBall(ball, delta) {
    if (!ball) return
    this.ctx.save()
    this.ctx.translate(ball.x, ball.y)
    this.ctx.fillStyle = '#ffffff'
    this.ctx.fillRect(-3, -3, 7, 7)
    this.ctx.restore()
  }
  renderPaddle(paddle, ball) {
    this.ctx.save()
    this.ctx.translate(paddle.x, paddle.y)
    this.ctx.fillStyle = '#4C5B5C'
    this.ctx.fillRect(-paddle.width * 0.5, -paddle.height * 0.5, paddle.width, paddle.height)
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.25)'
    this.ctx.fillRect(-paddle.width * 0.5, -paddle.height * 0.5, paddle.width, 2)
    if (ball) {
      const dx = ball.x - (paddle.x + paddle.width * 0.5)
      const dy = ball.y - paddle.y
      const d = dx * dx + dy * dy
      const o = 0.5 * Math.max(0, Math.min(1, 5000 / d))
      this.ctx.fillStyle = `rgba(255, 255, 255, ${o})`
      this.ctx.fillRect(-paddle.width * 0.5, -paddle.height * 0.5, paddle.width, 2)
    }
    this.ctx.restore()
  }
}