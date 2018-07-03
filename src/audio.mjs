export default class Audio {
  constructor() {
    document.addEventListener('click', () => {
      this.ctx = new window.AudioContext()
    })
  }
  play(events, delta, time) {
    if (!this.ctx) return
    if (events.smash) smash(this.ctx)
    if (events.bounce) bounce(this.ctx)
  }
}

function bounce(ctx) {
  const b = ctx.createOscillator()
  b.type = 'sine'
  b.frequency.value = 2092
  b.connect(ctx.destination)
  b.start(ctx.currentTime)
  b.stop(ctx.currentTime + 0.05)
}

function smash(ctx) {
  const s = ctx.createOscillator()
  s.type = 'sawtooth'
  s.frequency.value = 4194
  s.connect(ctx.destination)
  s.start(ctx.currentTime)
  s.stop(ctx.currentTime + 0.05)
}