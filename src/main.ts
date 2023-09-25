import './style.css'
import { World } from './World'
import { Transform } from './middlewares/Motion'
import { Vector } from './Vector'
import { Bunny } from './actors/Bunny'
import { $a, $v, $x, $y } from './types'
import { UserControl } from './middlewares/UserControl'

const ctrl = new UserControl()
const world = new World({ el: document.querySelector<HTMLDivElement>('#app')! })
  .addMiddleware(new Transform([new Vector(0, 0), new Vector(1000, 700)]))
  .addMiddleware(ctrl)
  .init()
  .start()

const bunny = new Bunny().init()
ctrl.setControlledActor(bunny)
// bunny.space[$v][$x] = 200
// bunny.space[$v][$y] = 200
// bunny.space[$a][$x] = -50
// bunny.rotationFrequency = 0.5

world.addActors(bunny)
