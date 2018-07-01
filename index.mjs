import Clock from './src/clock.mjs'
import Mouse from './src/mouse.mjs'
import Graphics from './src/graphics.mjs'

const canvas = document.getElementById('canvas')
const clock = new Clock()
const mouse = new Mouse(canvas)
const graphics = new Graphics(canvas)

clock.fixedUpdate((tick, time) => {

})

clock.update((delta, time) => {
  graphics.render(mouse.x, mouse.y)
})