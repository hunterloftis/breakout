const NOTES = {
  C: 32.703195662574829,
  D: 36.708095989675945,
  E: 41.203444614108741,
  F: 43.653528929125485,
  G: 48.999429497718661,
  A: 55.000000000000000,
  B: 61.735412657015513
}

export default class Audio {
  constructor() {
    document.addEventListener('click', () => {
      this.ctx = new window.AudioContext()
      this.gain = this.ctx.createGain()
      this.gain.gain.value = 0.1
      this.gain.connect(this.ctx.destination)
    })
  }
  play(events, delta, time) {
    if (!this.ctx) return
    if (events.win) this.win()
    if (events.ping) this.ping()
    if (events.miss) this.miss()
    if (events.smash) this.smash()
    else if (events.bounce) this.bounce()
  }
  win() {
    this.series('CDEFG', 4)
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
    const o = this.ctx.createOscillator()
    o.type = 'sawtooth'
    o.frequency.value = 65
    o.connect(this.gain)
    o.start(this.ctx.currentTime)
    o.stop(this.ctx.currentTime + 0.1)
  }
  ping() {
    const o = this.ctx.createOscillator()
    o.type = 'sawtooth'
    o.frequency.value = 4184
    o.connect(this.gain)
    o.start(this.ctx.currentTime)
    o.stop(this.ctx.currentTime + 0.05)
  }
  miss() {
    this.series('EDC', 3)
  }
  series(notes, octave) {
    const nn = notes.split('')
    nn.forEach((n, i) => this.tone(n, octave, i * 0.2))
  }
  tone(n, octave, delay) {
    const o = this.ctx.createOscillator()
    o.type = 'triangle'
    o.frequency.value = note(n, octave)
    o.connect(this.gain)
    o.start(this.ctx.currentTime + delay)
    o.stop(this.ctx.currentTime + delay + 0.1)
  }
}

function note(n, octave = 1) {
  return NOTES[n] * Math.pow(2, octave)
}