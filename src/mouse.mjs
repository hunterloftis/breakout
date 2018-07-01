export default class Mouse {
  constructor(el) {
    this.x = 0
    this.y = 0
    el.addEventListener('mousemove', e => {
      this.x = e.clientX - el.offsetLeft
      this.y = e.clientY - el.offsetTop
    })
  }
}