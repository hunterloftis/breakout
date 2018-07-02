const BIAS = 1e-6

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
    const dx = Math.cos(this.theta)
    const dy = Math.sin(this.theta)
    const v = this.v * secs
    const wallHit = this.intersect(container, v, true)
    const paddleHit = this.intersect(paddle, v)
    const hit = [wallHit, paddleHit].sort(((a, b) => a.dist - b.dist))[0]

    this.x += hit.dx
    this.y += hit.dy
    if (hit.type === Hit.IN_TOP || hit.type === Hit.BOTTOM) {
      this.theta = Math.atan2(Math.abs(dy), dx)
    }
    else if (hit.type === Hit.IN_BOTTOM || hit.type === Hit.TOP) {
      this.theta = Math.atan2(-Math.abs(dy), dx)
    }
    else if (hit.type === Hit.IN_LEFT || hit.type === Hit.RIGHT) {
      this.theta = Math.atan2(dy, Math.abs(dx))
    }
    else if (hit.type === Hit.IN_RIGHT || hit.type === Hit.LEFT) {
      this.theta = Math.atan2(dy, -Math.abs(dx))
    }
  }
  // https://github.com/hunterloftis/pbr2/blob/master/pkg/surface/cube.go#L31
  intersect(box, limit, interior = false) {
    const dx = Math.cos(this.theta)
    const dy = Math.sin(this.theta)

    const inside = this.x > box.left && this.x < box.right && this.y > box.top && this.y < box.bottom
    if (inside && !interior) {
      return Hit(Hit.IN, dx, dy, limit)
    }

    let tmin = 0
    let tmax = limit

    const invX = 1 / dx
    let tleft = (box.left - this.x) * invX
    let tright = (box.right - this.x) * invX
    tmin = Math.max(tmin, Math.min(tleft, tright))
    tmax = Math.min(tmax, Math.max(tleft, tright))
    if (tmax < tmin) {
      return Hit(Hit.NONE, dx, dy, limit)
    }

    const invY = 1 / dy
    let ttop = (box.top - this.y) * invY
    let tbottom = (box.bottom - this.y) * invY
    tmin = Math.max(tmin, Math.min(ttop, tbottom))
    tmax = Math.min(tmax, Math.max(ttop, tbottom))
    if (tmax < tmin) {
      return Hit(Hit.NONE, dx, dy, limit)
    }

    let hit
    if (tmin > 0) hit = tmin
    else if (tmax > 0) hit = tmax
    else {
      return Hit(Hit.NONE, dx, dy, limit)
    }

    if (hit === tleft) {
      return Hit(inside ? Hit.IN_LEFT : Hit.LEFT, dx, dy, hit * BIAS)
    }
    else if (hit === tright) {
      return Hit(inside ? Hit.IN_RIGHT : Hit.RIGHT, dx, dy, hit * BIAS)
    }
    else if (hit === ttop) {
      return Hit(inside ? Hit.IN_TOP : Hit.TOP, dx, dy, hit * BIAS)
    }
    else if (hit === tbottom) {
      return Hit(inside ? Hit.IN_BOTTOM : Hit.BOTTOM, dx, dy, hit * BIAS)
    }
    return Hit(Hit.NONE, dx, dy, limit)
  }
}

function Hit(type, x, y, dist) {
  return { type, dx: x * dist, dy: y * dist, dist }
}
Hit.NONE = 0
Hit.IN_TOP = 1
Hit.IN_BOTTOM = 2
Hit.IN_LEFT = 3
Hit.IN_RIGHT = 4
Hit.TOP = 5
Hit.BOTTOM = 6
Hit.LEFT = 7
Hit.RIGHT = 8
Hit.IN = 9