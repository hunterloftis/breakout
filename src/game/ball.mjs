const BIAS = 1e-6
const ACCELERATION = 5

const NONE = 0
const UP = 1
const DOWN = 2
const LEFT = 3
const RIGHT = 4

export default class Ball {
  constructor(minX, maxX, y, v = 300) {
    this.x = minX + (maxX - minX) * Math.random()
    this.y = y
    this.v = v
    this.bounce = 0
    this.theta = Math.PI * (1.1 + Math.random() * 0.8)
    this.intensity = 0
  }
  state() {
    const { v, dx, dy } = this.velocity(1)
    return {
      x: this.x,
      y: this.y,
      vx: dx * v,
      vy: dy * v
    }
  }
  velocity(tick) {
    const secs = tick / 1000
    const dx = Math.cos(this.theta)
    const dy = Math.sin(this.theta)
    const v = Math.min(500, (this.v + this.bounce * ACCELERATION) * secs)
    return { v, dx, dy }
  }
  move(tick, container, paddle, bricks) {
    const { v, dx, dy } = this.velocity(tick)
    const colliders = [container, paddle].concat(bricks)
    const hit = this.nearest(colliders, v)

    this.intensity = 0

    if (!hit) {
      this.x += dx * v
      this.y += dy * v
      return true
    }

    this.x += dx * hit.dist
    this.y += dy * hit.dist

    if (hit.dir === DOWN) {
      this.theta = Math.atan2(Math.abs(dy), dx)
    }
    else if (hit.dir === UP) {
      if (hit.target === paddle) {
        const px = (this.x - paddle.x) / (paddle.width * 0.5)
        this.theta = Math.PI * -0.5 + Math.PI * 0.3 * px
      } else {
        this.theta = Math.atan2(-Math.abs(dy), dx)
      }
    }
    else if (hit.dir === RIGHT) {
      this.theta = Math.atan2(dy, Math.abs(dx))
    }
    else if (hit.dir === LEFT) {
      this.theta = Math.atan2(dy, -Math.abs(dx))
    }

    this.bounce++
    this.intensity++
    if (hit.target.onHit) {
      this.intensity += hit.target.onHit(dx, dy)
    }

    if (hit.target === container && hit.dir === UP) {
      return false
    }
    return true
  }
  nearest(targets, limit) {
    return targets.reduce((prev, target) => {
      const box = target.box()
      if (!box) return prev

      const l = prev ? prev.dist : limit
      const [dir, dist] = this.intersect(box, l)
      if (dir === NONE) return prev

      return { target, dist, dir }
    }, undefined)
  }
  // https://github.com/hunterloftis/pbr2/blob/master/pkg/surface/cube.go#L31
  intersect(box, limit) {
    const inside = this.x >= box.left && this.x <= box.right && this.y >= box.top && this.y <= box.bottom
    if (inside === box.solid) {
      return [NONE, Infinity]
    }

    const dx = Math.cos(this.theta)
    const dy = Math.sin(this.theta)

    let tmin = 0
    let tmax = limit

    const invX = 1 / dx
    let tleft = (box.left - this.x) * invX
    let tright = (box.right - this.x) * invX
    tmin = Math.max(tmin, Math.min(tleft, tright))
    tmax = Math.min(tmax, Math.max(tleft, tright))
    if (tmax < tmin) {
      return [NONE, Infinity]
    }

    const invY = 1 / dy
    let ttop = (box.top - this.y) * invY
    let tbottom = (box.bottom - this.y) * invY
    tmin = Math.max(tmin, Math.min(ttop, tbottom))
    tmax = Math.min(tmax, Math.max(ttop, tbottom))
    if (tmax < tmin) {
      return [NONE, Infinity]
    }

    let hit
    if (tmin > 0) hit = tmin
    else if (tmax > 0) hit = tmax
    else return [NONE, Infinity]

    if (hit === tleft) return inside ? [RIGHT, hit] : [LEFT, hit]
    if (hit === tright) return inside ? [LEFT, hit] : [RIGHT, hit]
    if (hit === ttop) return inside ? [DOWN, hit] : [UP, hit]
    if (hit === tbottom) return inside ? [UP, hit] : [DOWN, hit]
    return [NONE, Infinity]
  }
}
