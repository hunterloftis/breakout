const BIAS = 1e-6

const NONE = 0
const UP = 1
const DOWN = 2
const LEFT = 3
const RIGHT = 4

export default class Ball {
  constructor(minX, maxX, y, v = 500) {
    this.x = minX + (maxX - minX) * Math.random()
    this.y = y
    this.v = v
    this.bounce = 0
    this.theta = Math.PI * (1.1 + Math.random() * 0.8)
  }
  move(tick, container, paddle) {
    const secs = tick / 1000
    const v = this.v * secs
    let [dx, dy] = this.intersect(container, v)
    // let hitP = this.intersect(paddle, dist)
    this.x += dx
    this.y += dy
    this.theta = Math.atan2(dy, dx)
  }
  intersect(box, limit) {
    const dx = Math.cos(this.theta)
    const dy = Math.sin(this.theta)

    const tleft = (box.left - this.x) * (1 / dx)
    const tright = (box.right - this.x) * (1 / dx)
    const ttop = (box.top - this.y) * (1 / dy)
    const tbottom = (box.bottom - this.y) * (1 / dy)
    const min = [tleft, tright, ttop, tbottom].filter(n => n > 0).sort((a, b) => a - b)
    const inside = this.x > box.left && this.x < box.right && this.y > box.top && this.y < box.bottom

    if (min.length === 0 || min[0] > limit) return [dx * limit, dy * limit]
    const hit = min[0]
    const vx = dx * hit
    const vy = dy * hit
    if (hit === tleft) {
      if (inside) return [Math.abs(vx), vy]
      return [-Math.abs(vx), vy]
    }
    if (hit === tright) {
      if (inside) return [-Math.abs(vx), vy]
      return [Math.abs(vx), vy]
    }
    if (hit === ttop) {
      if (inside) return [vx, Math.abs(vy)]
      return [vx, -Math.abs(vy)]
    }
    if (inside) return [vx, -Math.abs(vy)]
    return [vx, Math.abs(vy)]
  }
}
