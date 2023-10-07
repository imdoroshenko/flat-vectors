import { Graphics } from '@pixi/graphics'
import { AbstractActor, BodyType, IActor } from './AbstractActor'
import { Vector } from '../Vector'
import { $x, $y } from '../types'
import { cHeight, cWidth } from '../utils/bodies'

export type RectangleOptions = {
  width: number
  height: number

  fill?: number | null
  stroke?: number | null
}

export class Rectangle extends AbstractActor implements IActor {
  radius: number = 0
  graphics: Graphics
  bodyType: BodyType = 'rectangle'
  fill: number | null
  stroke: number | null
  height: number
  width: number
  pivot: Vector = new Vector(0, 0)
  constructor({ width, height, fill = null, stroke = null }: RectangleOptions) {
    super()
    this.width = width
    this.height = height
    this.graphics = new Graphics()
    this.fill = fill
    this.stroke = stroke
  }

  draw() {
    this.graphics.clear()
    if (this.fill) {
      this.graphics.beginFill(this.fill)
    }
    if (this.stroke) {
      this.graphics.lineStyle(1, this.stroke)
    }
    this.graphics.drawRect(
      this.polygon[0][$x],
      this.polygon[0][$y],
      this.width,
      this.height
    )
    this.graphics.pivot.set(...this.pivot)
    this.graphics.endFill()
  }

  init() {
    this.polygon.length = 0
    this.polygon.push(
      new Vector(0, 0),
      new Vector(this.width, 0),
      new Vector(this.width, this.height),
      new Vector(0, this.height)
    )
    this.pivot.set(cWidth(this) / 2, cHeight(this) / 2)
    this.draw()
    return this
  }

  destructor() {
    this.graphics.destroy()
  }
}
