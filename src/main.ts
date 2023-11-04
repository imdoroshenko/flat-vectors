import './style.css'
import { World } from './World'
import { GridManager, Tile } from './middlewares/Grid'

const gm = new GridManager()
gm.emmiter.on('onHover', (tile: Tile) => {
  gm.hightlightCoords(tile.x, tile.y, tile.z)
  console.log('hover', tile.x, tile.y)
})
// init world
const world = new World({ el: document.querySelector<HTMLDivElement>('#app')! })
  .addMiddleware(gm)
  .init()
  .start()
