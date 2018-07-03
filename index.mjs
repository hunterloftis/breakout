import Clock from './src/clock.mjs'
import Mouse from './src/mouse.mjs'
import Graphics from './src/graphics.mjs'
import Game from './src/game/game.mjs'

const canvas = document.getElementById('canvas')
const clock = new Clock()
const mouse = new Mouse(canvas)
const graphics = new Graphics(canvas)
const game = new Game(canvas.width, canvas.height)

document.addEventListener('pointerlockchange', () => {
  if (document.pointerLockElement === canvas) {
    clock.start()
  } else {
    clock.stop()
  }
})

canvas.addEventListener('click', () => {
  canvas.requestPointerLock()
})

clock.fixedUpdate((tick, time) => {
  game.movePaddle(mouse.x)
  game.fixedUpdate(tick, time)
})

clock.update((delta, time) => {
  game.update(delta, time)
  graphics.render(game.state(), delta)
})
