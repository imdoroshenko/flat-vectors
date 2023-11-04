import './style.css'
import { World } from './World'
import { GridManager, Tile } from './middlewares/Grid'

const gm = new GridManager()

// init world
const world = new World({ el: document.querySelector<HTMLDivElement>('#app')! })
  .addMiddleware(gm)
  .init()
  .start()

gm.event.on('onHover', (tile: Tile) => {
  gm.hightlightCoords(tile.x, tile.y, tile.z)
  console.log('hover', tile.x, tile.y, world.isPressed)
})
