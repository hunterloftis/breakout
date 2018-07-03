const BIAS = 1e-6
const ACCELERATION = 5

const NONE = 0
const TOP = 1
const BOTTOM = 2
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

    if (!hit) {
      this.x += dx * (v - BIAS)
      this.y += dy * (v - BIAS)
      return true
    }

    this.intensity = 0
    this.x += dx * hit.dist
    this.y += dy * hit.dist

    if (hit.edge === BOTTOM || hit.edge === TOP && hit.inside) {
      this.theta = Math.atan2(Math.abs(dy), dx)
    }
    if (hit.edge === TOP || hit.edge === BOTTOM && hit.inside) {
      if (hit.target === paddle) {
        const px = (this.x - paddle.x) / (paddle.width * 0.5)
        this.theta = Math.PI * 0.5 + Math.PI * 0.9 * px
      } else {
        this.theta = Math.atan2(-Math.abs(dy), dx)
      }
    }
    else if (hit.edge === RIGHT || hit.edge === LEFT && hit.inside) {
      this.theta = Math.atan2(dy, Math.abs(dx))
    }
    else if (hit.edge === LEFT || hit.edge === RIGHT && hit.inside) {
      this.theta = Math.atan2(dy, -Math.abs(dx))
    }

    this.bounce++
    this.intensity++
    if (hit.target.onHit) {
      this.intensity += hit.target.onHit(dx, dy)
    }
    this.intensity = 0

    if (hit.target === container && hit.bottom) {
      return false
    }
    return true
  }
  nearest(targets, limit) {
    return targets.reduce((hit, target) => {
      const box = target.box()
      if (!box) return hit

      const inside = this.x > box.left && this.x < box.right && this.y > box.top && this.y < box.bottom
      if (inside && box.solid) return hit

      const l = hit ? hit.dist : limit
      const [edge, dist] = this.intersect(box, l)
      if (edge === NONE) return hit

      return { target, dist, edge, inside }
    }, undefined)
  }
  // https://github.com/hunterloftis/pbr2/blob/master/pkg/surface/cube.go#L31
  intersect(box, limit) {
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

    if (hit === tleft) return [LEFT, hit]
    if (hit === tright) return [RIGHT, hit]
    if (hit === ttop) return [TOP, hit]
    if (hit === tbottom) return [BOTTOM, hit]
    return [NONE, Infinity]
  }
}
