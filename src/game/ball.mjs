const BIAS = 1e-6

export default class Ball {
  constructor(minX, maxX, y, v = 200) {
    this.x = minX + (maxX - minX) * Math.random()
    this.y = y
    this.v = v
    this.bounce = 0
    const theta = Math.PI * (1.1 + Math.random() * 0.8)
    this.dx = Math.cos(theta)
    this.dy = Math.sin(theta)
  }
  move(tick, container, paddle) {
    const secs = tick / 1000
    const v = this.v * secs
    let [dist, nx, ny] = this.intersect(container, v)
    // let hitP = this.intersect(paddle, dist)

  }
  intersect(box, limit) {
    const dx = this.dx
    const dy = this.dy

    const tleft = (box.left - this.x) * (1 / dx)
    const tright = (box.right - this.x) * (1 / dx)
    const ttop = (box.top - this.y) * (1 / dy)
    const tbottom = (box.bottom - this.y) * (1 / dy)
    const min = [tleft, tright, ttop, tbottom].filter(n => n > 0).sort()

    if (min.length === 0) return [0, 0, 0]
    if (min[0] === tleft) return [tleft, -1, 0]
    if (min[0] === tright) return [tright, 1, 0]
    if (min[0] === ttop) return [ttop, 0, 1]
    return [tbottom, 0, -1]
  }
}