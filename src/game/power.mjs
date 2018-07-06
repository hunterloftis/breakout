const GRAVITY = -2
const LEVEL = 20
const MOMENTUM = 0.99
const DURATION = 20000
const SPACING = 70
const MARGINS = 150
const MAX_SPEED = 150
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
    do {
      const t = Math.floor(Math.random() * Object.keys(TYPES).length)
      const type = Object.keys(TYPES)[t]
      this.type = TYPES[type]
    } while (this.type === TYPES.TRIPLE_SCORE)  // disable TRIPLE_SCORE, it doesn't add to the fun
    this.remaining = DURATION
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
      remaining: this.remaining,
    }
  }
  fixedUpdate(tick, time, powers, width) {
    this.remaining = Math.max(0, this.remaining - tick)
    const secs = tick / 1000
    const vx = this.x - this.x1
    const vy = this.y - this.y1
    this.x1 = this.x
    this.y1 = this.y
    this.x += vx * MOMENTUM
    this.y += vy * MOMENTUM + GRAVITY * secs
    powers.forEach(p => {
      if (p === this) return
      this.repel(p.x, p.y, SPACING, tick)
    })
    this.repel(0, 0, MARGINS, tick)
    this.repel(width, 0, MARGINS, tick)
    const dx = this.x - this.x1
    const dy = this.y - this.y1
    const dist = Math.sqrt(dx * dx + dy * dy)
    const max = MAX_SPEED * tick / 1000
    if (dist > max) {
      this.x = this.x1 + dx * (max / dist)
      this.y = this.y1 + dy * (max / dist)
    }
    if (this.remaining > 0 && this.y < LEVEL) {
      this.y = LEVEL
    }
    return this.y < 800 && this.y > -10
  }
  repel(x, y, range, tick) {
    const dx = this.x - x
    const dy = this.y - y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const force = Math.max(0, range - dist) * tick / 1000
    this.x += dx * force
    this.y += dy * force
  }
}