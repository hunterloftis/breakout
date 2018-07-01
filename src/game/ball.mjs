export default class Ball {
  constructor(minX, maxX, y, r = 5, v = 400) {
    this.x = this.x1 = minX + (maxX - minX) * Math.random()
    this.y = this.y1 = y
    this.r = r
    this.v = v
    this.ax = 0
    this.ay = 0
    const theta = Math.PI * (1.05 + Math.random() * 0.9)
    this.impulse(v * Math.cos(theta), v * Math.sin(theta))
  }
  impulse(x, y) {
    this.ax += x
    this.ay += y
  }
  accelerate(tick) {
    const secs = tick / 1000
    this.x += this.ax * secs
    this.y += this.ay * secs
    this.ax = this.ay = 0
    const vx = this.x - this.x1
    const vy = this.y - this.y1
    return { vx, vy }
    // const len = Math.sqrt(vx * vx + vy * vy)
    // if (isNaN(len) || len === 0) {
    //   return { vx: 0, vy: 0 }
    // }
    // return {
    //   vx: this.v * vx / len * tick / 1000,
    //   vy: this.v * vy / len * tick / 1000
    // }
  }
  integrate(tick) {
    const { vx, vy } = this.accelerate(tick)
    this.x1 = this.x
    this.y1 = this.y
    this.x += vx
    this.y += vy
  }
  correct(x, y, elastic = 1) {
    const vx0 = this.x - this.x1
    const vy0 = this.y - this.y1
    const v = Math.sqrt(vx0 * vx0 + vy0 * vy0)
    const vx = vx0 / v
    const vy = vy0 / v

    this.x += x
    this.y += y

    const len = Math.sqrt(x * x + y * y)
    const nx = x / len
    const ny = y / len
    const dot = vx * nx + vy * ny
    const rx = (vx - (dot * nx * 2)) * v
    const ry = (vy - (dot * ny * 2)) * v

    this.x1 = elastic * (this.x - rx) + (1 - elastic) * this.x1
    this.y1 = elastic * (this.y - ry) + (1 - elastic) * this.y1
  }
  constrainIn(box) {
    const top = box.top + this.r - this.y
    const bottom = box.bottom - this.r - this.y
    const left = box.left + this.r - this.x
    const right = box.right - this.r - this.x
    if (top > 0) this.correct(0, top)
    if (bottom < 0) this.correct(0, bottom)
    if (left > 0) this.correct(left, 0)
    if (right < 0) this.correct(right, 0)
  }
  constrainOut(box) {
    if (this.x > box.left && this.y < box.right) {
      if (this.constrainFrom(this.x, box.top)) return true
      if (this.constrainFrom(this.x, box.bottom)) return true
    }

    if (this.y > box.top && this.y < box.bottom) {
      if (this.constrainFrom(box.left, this.y)) return true
      if (this.constrainFrom(box.right, this.y)) return true
    }

    if (this.constrainFrom(box.left, box.top)) return true
    if (this.constrainFrom(box.right, box.top)) return true
    if (this.constrainFrom(box.left, box.bottom)) return true
    if (this.constrainFrom(box.right, box.bottom)) return true

    if (this.x > box.left && this.x < box.right && this.y > box.top && this.y < box.bottom) {
      const left = Math.abs(this.x - box.left)
      const right = Math.abs(this.x - box.right)
      const top = Math.abs(this.y - box.top)
      const bottom = Math.abs(this.y - box.bottom)
      const exit = Math.min(left, right, top, bottom)
      if (exit === left) this.correct(-left, 0)
      else if (exit === right) this.correct(right, 0)
      else if (exit === top) this.correct(0, -top)
      else this.correct(0, top)
      return true
    }

    return false
  }
  constrainFrom(x, y) {
    const dx = this.x - x
    const dy = this.y - y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (isNaN(dist) || dist === 0) {
      return false
    }
    if (dist < this.r) {
      this.correct(dx, dy)
      return true
    }
    return false
  }
}