import Clock from './src/clock.mjs'
import Mouse from './src/mouse.mjs'
import Graphics from './src/graphics.mjs'
import Game from './src/game/game.mjs'

const canvas = document.getElementById('canvas')
const clock = new Clock()
const mouse = new Mouse(canvas)
const graphics = new Graphics(canvas)
const game = new Game(canvas.width, canvas.height)

clock.fixedUpdate((tick, time) => {
  game.moveTo(mouse.x)
  game.fixedUpdate(tick, time)
})

clock.update((delta, time) => {
  graphics.render(game.state())
})