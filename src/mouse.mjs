export default class Mouse {
  constructor(canvas, margin = 0) {
    this.x = canvas.width * 0.5
    this.y = canvas.height * 0.5

    document.addEventListener('mousemove', e => {
      this.x = Math.max(margin, Math.min(canvas.width - margin, this.x + e.movementX))
      this.y = Math.max(margin, Math.min(canvas.height - margin, this.y + e.movementY))
    })
  }
}