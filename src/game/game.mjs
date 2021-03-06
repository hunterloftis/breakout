import Paddle from './paddle.mjs'
import Ball from './ball.mjs'
import Power from './power.mjs'
import Level from './level.mjs'

const BALL_DELAY = 1000
const PADDLE_WIDTH = 100

const EVENTS = {
  bounce: false,
  smash: false,
  death: false,
  ping: false,
  miss: false,
  win: false,
}

export default class Game {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.paddle = new Paddle(width * 0.5, this.height - 30, PADDLE_WIDTH)
    this.ball = undefined
    this.level = 1
    this.intensity = 0
    this.bricks = Level(this.level, this.box())
    this.particles = []
    this.powers = []
    this.clones = []
    this.events = { ...EVENTS }
    this.lives = 3
    this.score = 0
    this.modes = {
      play: new GamePlay(),
      win: new GameWin(),
      lose: new GameLose(),
      clear: new GameClear(),
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
      particles: this.particles.map(p => p.state()),
      powers: this.powers.map(p => p.state()),
      clones: this.clones.map(c => c.state()),
      intensity: this.intensity,
      lives: this.lives,
      score: this.score,
      level: this.level,
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
      game.events.win = true
      return game.modes.clear
    }
    if (this.nextBall === 0) {
      this.nextBall = time + BALL_DELAY
    }
    if (!game.ball && time > this.nextBall) {
      game.ball = new Ball(game.width * 0.1, game.width * 0.9, game.paddle.y - game.paddle.height * 3)
    }

    const bigPaddle = game.powers.filter(p => p.type === Power.types().BIG_PADDLE).length
    const paddleSize = 1 + 0.5 * bigPaddle
    game.paddle.resize(PADDLE_WIDTH * paddleSize)
    game.paddle.fixedUpdate(tick, time)

    if (game.ball) {
      const superBall = !!game.powers.find(p => p.type === Power.types().SUPER_BALL)
      game.ball.setPower(superBall ? 10 : 1)

      const cloneBalls = game.powers.filter(p => p.type === Power.types().CLONE_BALL).length
      game.ball.setClones(cloneBalls)

      const [inPlay, bounce, intensity] = game.ball.move(tick, game, game.paddle, game.bricks)
      const clones = game.ball.flushClones()
      game.clones.push(...clones)

      if (!inPlay) {
        game.ball = undefined
        game.lives--
        this.nextBall = time + BALL_DELAY
        game.events.miss = true
      }
      game.intensity += intensity
      game.events.bounce = bounce
    }

    game.clones = game.clones.filter(c => {
      const [inPlay, bounce, intensity] = c.move(tick, game, game.paddle, game.bricks)
      game.intensity += intensity
      game.events.bounce = game.events.bounce || bounce
      return inPlay
    })

    const particles = [].concat(...game.bricks.map(b => b.flushParticles()))
    const powers = game.bricks.map(b => b.flushPower()).filter(p => p)
    game.bricks = game.bricks.filter(b => b.alive())

    game.particles.push(...particles)
    if (particles.length) {
      const tripleScore = game.powers.filter(p => p.type === Power.types().TRIPLE_SCORE).length
      const multiplier = 1 + 3 * tripleScore
      game.events.smash = true
      game.score += (70 + game.lives * 10) * multiplier
    }

    game.powers.push(...powers)
    game.powers = game.powers.filter(p => p.fixedUpdate(tick, time, game.powers, game.width))
  }
}

class GameClear {
  fixedUpdate(game, tick, time) {
    game.ball = undefined
    game.powers = []
    game.clones = []
    game.bricks = Level(game.level + 1, game.box())
    if (!game.bricks.length) {
      return game.modes.win
    }
    game.level++
    game.lives = Math.min(5, game.lives + 1)
    game.modes.play.nextBall = 0
    return game.modes.play
  }
}

class GameWin {
  fixedUpdate(game, tick, time) {
    game.ball = undefined
    game.powers = []
    game.clones = []
  }
}

class GameLose {
  fixedUpdate(game, tick, time) {
    game.ball = undefined
    game.powers = []
    game.clones = []

    if (game.bricks.length && Math.random() < 0.5) {
      game.bricks[0].onHit(0, 0, 10)
    }
    const particles = [].concat(...game.bricks.map(b => b.flushParticles()))
    game.bricks = game.bricks.filter(b => b.alive())

    game.particles.push(...particles)
    if (particles.length) {
      game.events.ping = true
    }
  }
}
