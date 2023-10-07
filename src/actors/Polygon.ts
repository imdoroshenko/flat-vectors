import { Graphics } from '@pixi/graphics'
import { AbstractActor, BodyType, IActor } from './AbstractActor'
import { Vector } from '../Vector'
import { cHeight, cWidth } from '../utils/bodies'

export type PolygonOptions = {
  polygon: Vector[]
  fill?: number | null
  stroke?: number | null
}

export class Polygon extends AbstractActor implements IActor {
  radius: number = 0
  graphics: Graphics
  bodyType: BodyType = 'polygon'
  fill: number | null
  stroke: number | null
  pivot: Vector = new Vector(0, 0)
  constructor({ polygon, fill = null, stroke = null }: PolygonOptions) {
    super()
    this.graphics = new Graphics()
    this.fill = fill
    this.stroke = stroke
    this.polygon.push(...polygon)
  }

  draw() {
    this.graphics.clear()
    if (this.fill) {
      this.graphics.beginFill(this.fill)
    }
    if (this.stroke) {
      this.graphics.lineStyle(1, this.stroke)
    }
    this.graphics.drawPolygon(this.polygon)
    this.graphics.pivot.set(...this.pivot)
    this.graphics.endFill()
  }

  init() {
    this.pivot.set(cWidth(this) / 2, cHeight(this) / 2)
    this.draw()
    return this
  }

  destructor() {
    this.graphics.destroy()
  }
}
