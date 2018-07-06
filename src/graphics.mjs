
const BRICK_COLORS = ['#A40606', '#D98324']
const POWER_GRAPHIC = ['🏓', 'x3', '💥', '🐇']

export default class Graphics {
  constructor(canvas) {
    this.canvas = canvas
    this.canvas.style.background = '#000000'
    this.ctx = canvas.getContext('2d')
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.time = 0
  }
  render(state, delta, paused = false) {
    this.time += delta

    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.33)'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.ctx.save()
    if (state.intensity > 3) {
      this.ctx.translate(Math.random() * state.intensity, Math.random() * state.intensity)
    }
    state.bricks.forEach(b => this.renderBrick(b, state.ball))
    state.clones.forEach(c => this.renderClone(c))
    this.renderBall(state.ball, delta)
    this.renderPaddle(state.lives, state.bricks.length, state.paddle, state.ball)
    state.particles.forEach(p => this.renderParticle(p))
    this.renderStats(state.lives, state.bricks.length, state.score)
    state.powers.forEach(p => this.renderPower(p))
    this.renderPause(paused)
    this.ctx.restore()
  }
  renderStats(lives, bricks, score) {
    this.ctx.save()
    this.ctx.fillStyle = '#ffffff'
    this.ctx.font = '14pt sans-serif'
    this.ctx.textBaseline = 'top'
    const s = Array(lives).fill('❤️').join(' ')
    this.ctx.fillText(s, 10, 10)
    this.ctx.textAlign = 'right'
    this.ctx.fillText(`⭐️ ${score}`, this.canvas.width - 15, 10)
    if (bricks === 0) {
      this.ctx.font = '72pt sans-serif'
      this.ctx.textAlign = 'center'
      this.ctx.textBaseline = 'middle'
      if (lives > 0) {
        this.ctx.fillText('🏆🏆🏆', this.canvas.width * 0.5, this.canvas.height * 0.5)
      } else {
        this.ctx.fillText('Game Over', this.canvas.width * 0.5, this.canvas.height * 0.5)
      }
    }
    this.ctx.restore()
  }
  renderPause(paused) {
    if (!paused) return
    this.ctx.save()
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.font = '72pt sans-serif'
    this.ctx.fillStyle = '#ffffff'
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'
    this.ctx.fillText('Click to start', this.canvas.width * 0.5, this.canvas.height * 0.5)
    this.ctx.restore()
  }
  renderBrick(brick, ball) {
    if (!brick) return
    if (brick.lives < 1) return

    this.ctx.save()
    this.ctx.translate(brick.x, brick.y)
    this.ctx.beginPath()
    this.ctx.fillStyle = BRICK_COLORS[brick.lives - 1] || '#ff0000'
    this.ctx.fillRect(1, 1, brick.width - 2, brick.height - 2)
    this.ctx.beginPath()
    this.ctx.fillStyle = `rgba(255, 255, 255, 0.2)`
    this.ctx.fillRect(3, 1, brick.width - 6, 2)

    if (ball) {
      const shine = brick.hasPower ? 1 : 0.4
      this.ctx.beginPath()
      if (ball.x < brick.x + brick.width) {
        const dx = ball.x - brick.x
        const dy = ball.y - (brick.y + brick.height * 0.5)
        const d = dx * dx + dy * dy
        const o = shine * Math.max(0, Math.min(1, 70000 / d))
        this.ctx.fillStyle = `rgba(255, 255, 255, ${o})`
        this.ctx.fillRect(1, 3, 2, brick.height - 6)
      }
      if (ball.x > brick.x) {
        const dx = ball.x - brick.x + brick.width
        const dy = ball.y - (brick.y + brick.height * 0.5)
        const d = dx * dx + dy * dy
        const o = shine * Math.max(0, Math.min(1, 70000 / d))
        this.ctx.fillStyle = `rgba(255, 255, 255, ${o})`
        this.ctx.fillRect(brick.width - 4, 3, 2, brick.height - 6)
      }
      this.ctx.beginPath()
      if (ball.y < brick.y + brick.height) {
        const dx = ball.x - (brick.x + brick.width * 0.5)
        const dy = ball.y - brick.y
        const d = dx * dx + dy * dy
        const o = shine * Math.max(0, Math.min(1, 70000 / d))
        this.ctx.fillStyle = `rgba(255, 255, 255, ${o})`
        this.ctx.fillRect(3, 1, brick.width - 6, 2)
      }
      if (ball.y > brick.y) {
        const dx = ball.x - (brick.x + brick.width * 0.5)
        const dy = ball.y - brick.y + brick.height
        const d = dx * dx + dy * dy
        const o = shine * Math.max(0, Math.min(1, 70000 / d))
        this.ctx.fillStyle = `rgba(255, 255, 255, ${o})`
        this.ctx.fillRect(3, brick.height - 4, brick.width - 6, 2)
      }
      if (brick.hasPower) {
        this.ctx.fillStyle = `rgba(255, 255, 255, 0.3)`
        this.ctx.fillRect(1, 1, brick.width - 2, brick.height - 2)
      }
    }
    this.ctx.restore()
  }
  renderParticle(part) {
    this.ctx.fillStyle = BRICK_COLORS[0] || '#A40606'
    this.ctx.fillRect(part.x - 1, part.y - 1, 3, 3)
  }
  renderPower(p) {
    const secs = Math.round(p.remaining / 1000)
    const text = `${secs} ${POWER_GRAPHIC[p.type] || '?'}`
    this.ctx.save()
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.025)'
    this.ctx.translate(p.x, p.y)
    this.ctx.beginPath()
    this.ctx.arc(0, 0, 45, 0, Math.PI * 2)
    this.ctx.fill()
    this.ctx.beginPath()
    this.ctx.arc(0, 0, 30, 0, Math.PI * 2)
    this.ctx.fill()
    this.ctx.beginPath()
    this.ctx.font = '14pt sans-serif'
    this.ctx.fillStyle = '#ffffff'
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'
    this.ctx.fillText(text, 0, 0)
    this.ctx.restore()
  }
  renderBall(ball, delta) {
    if (!ball) return
    this.ctx.save()
    this.ctx.translate(ball.x, ball.y)
    if (ball.power > 1) {
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.25)'
      this.ctx.fillRect(-6, -6, 14, 14)
    }
    this.ctx.fillStyle = '#ffffff'
    this.ctx.fillRect(-3, -3, 7, 7)
    this.ctx.restore()
  }
  renderClone(clone) {
    this.ctx.save()
    this.ctx.translate(clone.x, clone.y)
    this.ctx.fillStyle = '#00ffff'
    this.ctx.fillRect(-2, -2, 5, 5)
    this.ctx.restore()
  }
  renderPaddle(lives, bricks, paddle, ball) {
    if (lives === 0 || bricks === 0) return
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