import './style.css'
import { World } from './World'
import { Transform } from './middlewares/Motion'
import { Vector } from './Vector'
import { Bunny } from './actors/Bunny'
// import { $a, $v, $x, $y } from './types'
import { UserControl } from './middlewares/UserControl'
import { Circle } from './actors/Circle'
import { $r, $x, $y } from './types'
import { Rectangle } from './actors/Rectangle'

const ctrl = new UserControl()
const world = new World({ el: document.querySelector<HTMLDivElement>('#app')! })
  .addMiddleware(new Transform([new Vector(0, 0), new Vector(1000, 700)]))
  .addMiddleware(ctrl)
  .init()
  .start()

const bunny = new Bunny().init()

const circle1 = new Circle({ radius: 20, stroke: 0xfff }).init()
const circle2 = new Circle({ radius: 60, stroke: 0xfff }).init()
const rect1 = new Rectangle({ width: 400, height: 200, stroke: 0xfff }).init()

circle1.space[$r][$x] = 200
circle1.space[$r][$y] = 300
circle2.space[$r][$x] = 600
circle2.space[$r][$y] = 500
rect1.space[$r][$x] = 600
rect1.space[$r][$y] = 300

ctrl.setControlledActor(bunny)
world.addActors(bunny, circle1, circle2, rect1)
