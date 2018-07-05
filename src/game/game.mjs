import Paddle from './paddle.mjs'
import Ball from './ball.mjs'
import Brick from './brick.mjs'

const BALL_DELAY = 1000

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
    this.score = 0
    this.modes = {
      play: new GamePlay(),
      win: new GameWin(),
      lose: new GameLose()
    }
    this.mode = this.modes.play
  }
  movePaddle(x) {
    this.paddle.moveTo(x, this.paddle.y, 0, this.width)
  }
  paddleWidth() {
    return this.paddle.width
  }
  fixedUpdate(tick, time) {
    this.mode = this.mode.fixedUpdate(this, tick, time) || this.mode
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
      score: this.score
    }
  }
}

class GamePlay {
  constructor() {
    this.nextBall = 0
  }
  fixedUpdate(game, tick, time) {
    if (game.lives === 0) {
      game.events.death = true
      return game.modes.lose
    }
    if (game.bricks.length === 0) {
      return game.modes.win
    }
    if (!game.ball && time > this.nextBall) {
      game.ball = new Ball(game.width * 0.1, game.width * 0.9, game.paddle.y - game.paddle.height * 3)
    }

    if (game.ball) {
      const [inPlay, bounce, intensity] = game.ball.move(tick, game, game.paddle, game.bricks)
      if (!inPlay) {
        game.ball = undefined
        game.lives--
        this.nextBall = time + BALL_DELAY
      }
      game.intensity += intensity
      game.events.bounce = bounce
    }

    const particles = [].concat(...game.bricks.map(b => b.destroy()))
    game.particles.push(...particles)
    game.bricks = game.bricks.filter(b => b.alive())
    if (particles.length) {
      game.events.smash = true
      game.score += 70 + game.lives * 10
    }
  }
}

class GameWin {
  fixedUpdate(game, tick, time) {
    game.ball = undefined
  }
}

class GameLose {
  fixedUpdate(game, tick, time) {
    if (game.bricks.length && Math.random() < 0.5) {
      game.bricks[0].onHit(0, 0, 10)
    }
    const particles = [].concat(...game.bricks.map(b => b.destroy()))
    game.particles.push(...particles)
    game.bricks = game.bricks.filter(b => b.alive())
    if (particles.length) {
      game.events.smash = true
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