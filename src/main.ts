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
import { Polygon } from './actors/Polygon'
import { Colision } from './middlewares/Colision'

const ctrl = new UserControl()
const world = new World({ el: document.querySelector<HTMLDivElement>('#app')! })
  .addMiddleware(new Colision())
  .addMiddleware(new Transform([new Vector(0, 0), new Vector(1000, 700)]))
  .addMiddleware(ctrl)
  .init()
  .start()

const bunny = new Bunny().init()

const circle1 = new Circle({ radius: 20, stroke: 0xfff }).init()
const circle2 = new Circle({ radius: 60, stroke: 0xfff }).init()
// const rect1 = new Rectangle({ width: 400, height: 200, stroke: 0xfff }).init()

const randomPolygon = () => {
  const p = new Polygon({
    polygon: [
      new Vector(0, 0),
      new Vector(400, 0),
      new Vector(400, 200),
      new Vector(0, 200),
    ],
    stroke: 0xfff,
  }).init()
  p.space[$r][$x] = Math.random() * 1000
  p.space[$r][$y] = Math.random() * 1000
  return p
}

const polygons = Array.from({ length: 100 }, () => randomPolygon())

const poly1 = new Polygon({
  polygon: [
    new Vector(0, 20),
    new Vector(50, 0),
    new Vector(100, 20),
    new Vector(150, 100),
    new Vector(0, 150),
  ],
  stroke: 0xfff,
}).init()
const poly2 = new Polygon({
  polygon: [
    new Vector(0, 0),
    new Vector(400, 0),
    new Vector(400, 200),
    new Vector(0, 200),
  ],
  stroke: 0xfff,
}).init()

circle1.space[$r].set(200, 300)
circle2.space[$r].set(600, 500)
// rect1.space[$r].set(600, 300)
poly1.space[$r].set(200, 500)
poly2.space[$r].set(600, 300)

// ctrl.setControlledActor(bunny)
ctrl.setControlledActor(poly1)
world.addActors(bunny, circle1, circle2, poly1, poly2)
