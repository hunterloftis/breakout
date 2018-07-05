import Clock from './src/clock.mjs'
import Mouse from './src/mouse.mjs'
import Graphics from './src/graphics.mjs'
import Game from './src/game/game.mjs'
import Audio from './src/audio.mjs'

const canvas = document.getElementById('canvas')
const clock = new Clock()
const graphics = new Graphics(canvas)
const game = new Game(canvas.width, canvas.height)
const mouse = new Mouse(canvas, game.paddleWidth() * 0.5)
const audio = new Audio()

mouse
  .lock(() => clock.start())
  .unlock(() => {
    clock.stop()
    graphics.render(game.state(), 0, true)
  })

clock
  .fixedUpdate((tick, time) => {
    game.movePaddle(mouse.x)
    game.fixedUpdate(tick, time)
  })
  .update((delta, time) => {
    game.update(delta, time)
    graphics.render(game.state(), delta)
    audio.play(game.flushEvents(), delta, time)
  })

graphics.render(game.state(), 0, true)

// debug
window.game = game
window.audio = audio
