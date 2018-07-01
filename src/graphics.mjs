export default class Graphics {
  constructor(canvas) {
    this.canvas = canvas
    this.canvas.style.background = '#000000'
    this.canvas.style.cursor = 'none'
    this.ctx = canvas.getContext('2d')
  }
  render(x, y) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.fillStyle = '#ffffff'
    this.ctx.fillRect(x - 10, y - 10, 21, 21)
  }
}