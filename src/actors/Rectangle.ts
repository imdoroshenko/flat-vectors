import { Graphics } from '@pixi/graphics'
import { AbstractActor, BodyType, IActor } from './AbstractActor'
import { Vector } from '../Vector'
import { $x, $y } from '../types'

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
  constructor({ width, height, fill = null, stroke = null }: RectangleOptions) {
    super()
    this.width = width
    this.height = height
    this.graphics = new Graphics()
    this.fill = fill
    this.stroke = stroke
  }

  init() {
    this.graphics.clear()
    if (this.fill) {
      this.graphics.beginFill(this.fill)
    }
    if (this.stroke) {
      this.graphics.lineStyle(1, this.stroke)
    }
    this.polygon.length = 0
    this.polygon.push(
      new Vector(-this.width / 2, -this.height / 2),
      new Vector(this.width / 2, -this.height / 2),
      new Vector(this.width / 2, this.height / 2),
      new Vector(-this.width / 2, this.height / 2)
    )
    this.graphics.drawRect(
      this.polygon[0][$x],
      this.polygon[0][$y],
      this.width,
      this.height
    )
    this.graphics.endFill()
    return this
  }

  destructor() {
    this.graphics.destroy()
  }
}
