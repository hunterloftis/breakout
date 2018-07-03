export default class Audio {
  constructor() {
    document.addEventListener('click', () => {
      this.ctx = new window.AudioContext()
      this.gain = this.ctx.createGain()
      this.gain.gain.value = 0.3
      this.gain.connect(this.ctx.destination)
    })
  }
  play(events, delta, time) {
    if (!this.ctx) return
    if (events.smash) this.smash()
    if (events.bounce) this.bounce()
  }
  bounce() {
    const b = this.ctx.createOscillator()
    b.type = 'sine'
    b.frequency.value = 2092
    b.connect(this.gain)
    b.start(this.ctx.currentTime)
    b.stop(this.ctx.currentTime + 0.05)
  }
  smash() {
    const s = this.ctx.createOscillator()
    s.type = 'sawtooth'
    s.frequency.value = 4194
    s.connect(this.gain)
    s.start(this.ctx.currentTime)
    s.stop(this.ctx.currentTime + 0.05)
  }
}
