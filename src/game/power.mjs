const GRAVITY = -1
const LEVEL = 20
const MOMENTUM = 0.99
const DURATION = 20000
const TYPES = {
  BIG_PADDLE: 0,
  TRIPLE_SCORE: 1,
  SUPER_BALL: 2,
  CLONE_BALL: 3,
}

export default class Power {
  static types() {
    return TYPES
  }
  constructor(x, y, dx, dy) {
    const t = Math.floor(Math.random() * Object.keys(TYPES).length)
    const type = Object.keys(TYPES)[t]
    this.type = TYPES[type]
    this.endTime = 0
    this.x = this.x1 = x
    this.y = this.y1 = y
    this.x += dx + Math.random() - 0.5
    this.y += dy + Math.random() - 0.5
  }
  state() {
    return {
      type: this.type,
      x: this.x,
      y: this.y,
    }
  }
  fixedUpdate(tick, time) {
    if (!this.endTime) {
      this.endTime = time + DURATION
    }
    const secs = tick / 1000
    const vx = this.x - this.x1
    const vy = this.y - this.y1
    this.x1 = this.x
    this.y1 = this.y
    this.x += vx * MOMENTUM
    this.y += vy * MOMENTUM + GRAVITY * secs
    if (time < this.endTime && this.y < LEVEL) {
      this.y = LEVEL
    }
    return this.y < 800 && this.y > -10
  }
}