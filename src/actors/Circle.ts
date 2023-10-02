import { Graphics } from '@pixi/graphics'
import { AbstractActor, BodyType, IActor } from './AbstractActor'
import { cHeight, cWidth } from '../utils/bodies'

export type CircleOptions = {
  radius: number
  fill?: number | null
  stroke?: number | null
}

export class Circle extends AbstractActor implements IActor {
  radius: number = 0
  graphics: Graphics
  bodyType: BodyType = 'circle'
  fill: number | null
  stroke: number | null
  constructor({ radius, fill = null, stroke = null }: CircleOptions) {
    super()
    this.radius = radius
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
    this.graphics.drawCircle(0, 0, this.radius)
    this.graphics.pivot.set(cWidth(this) / 2, cHeight(this) / 2)
    this.graphics.endFill()
    return this
  }

  destructor() {
    this.graphics.destroy()
  }
}
