import Clock from './src/clock.mjs'
import Mouse from './src/mouse.mjs'
import Graphics from './src/graphics.mjs'
import Game from './src/game/game.mjs'

const canvas = document.getElementById('canvas')
const clock = new Clock()
const graphics = new Graphics(canvas)
const game = new Game(canvas.width, canvas.height)
const mouse = new Mouse(canvas, game.paddleWidth() * 0.5)

document.addEventListener('pointerlockchange', start)
canvas.addEventListener('click', () => canvas.requestPointerLock())

clock.fixedUpdate((tick, time) => {
  game.movePaddle(mouse.x)
  game.fixedUpdate(tick, time)
})

clock.update((delta, time) => {
  game.update(delta, time)
  graphics.render(game.state(), delta)
})

start()

function start() {
  if (document.pointerLockElement === canvas) {
    clock.start()
  } else {
    clock.stop()
    graphics.render(game.state(), 0, true)
  }
}