export default class Mouse {
  constructor(canvas) {
    this.x = canvas.width * 0.5
    this.y = canvas.height * 0.5
    document.addEventListener('mousemove', e => {
      this.x = Math.max(0, Math.min(canvas.width, this.x + e.movementX))
      this.y = Math.max(0, Math.min(canvas.height, this.y + e.movementY))
    })
  }
}