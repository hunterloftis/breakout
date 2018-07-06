import Brick from './brick.mjs'

const COLS = 17
const ROWS = 9


export default function Level(n, container) {
  const fn = levels[n - 1]
  if (!fn) return []

  const top = (container.bottom - container.top) * 0.1
  const bottom = (container.bottom - container.top) * 0.6
  const { left, right } = container
  const box = {
    left, right, top, bottom,
    width: (right - left),
    height: (bottom - top),
  }
  const dx = box.width / COLS
  const dy = box.height / ROWS
  const bricks = []
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const lives = fn(x, y)
      if (lives > 0) {
        bricks.push(new Brick(box.left + x * dx, box.top + y * dy, dx, dy, lives))
      }
    }
  }
  const p = Math.ceil(bricks.length * 0.15)
  while (bricks.filter(b => b.hasPower).length < p) {
    const i = Math.floor(Math.random() * bricks.length)
    bricks[i].hasPower = true
  }
  return bricks
}

const levels = [
  (x, y) => {
    if (x === 0 || x === COLS - 1) return 0
    if (y % 2 === 0) return 0
    if (y % 4 === 1 && (x === 1 || x === COLS - 2)) return 0
    return 2
  },
  (x, y) => {
    if (x < 1 || x > COLS - 2 || y < 0 || y > ROWS - 1) return 0
    if (y === Math.floor(ROWS / 2)) return 0
    if (x === 1 || x === COLS - 2) return 2
    if (y === 0 || y === ROWS - 1) return 2
    if (y > 1 && y < ROWS - 2 && x >= 3 && x <= COLS - 4 && x % 2 === 1) return 1
    return 0
  }
]
