import './style.css'
import { World } from './World'
import { GridManager } from './middlewares/Grid'

// init world
const world = new World({ el: document.querySelector<HTMLDivElement>('#app')! })
  .addMiddleware(new GridManager())
  .init()
  .start()
