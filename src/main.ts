import './style.css'
import { World } from './World'
import { Motion } from './middlewares/Motion'
import { Vector } from './Vector'
import { Bunny } from './objects/Bunny'
import { $a, $v, $x, $y } from './types'

const world = new World({ el: document.querySelector<HTMLDivElement>('#app')! })
  .addMiddleware(new Motion([new Vector(0, 0), new Vector(1000, 700)]))
  .init()
  .start()

const bunny = new Bunny().init()

bunny.space[$v][$x] = 200
bunny.space[$v][$y] = 200
bunny.space[$a][$x] = -50
bunny.rotationFrequency = 0.5

world.addObjects(bunny)

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
