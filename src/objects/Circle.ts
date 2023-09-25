import { Graphics } from '@pixi/graphics'
import { $x, $y } from '../types'
import { AbstractObject, IObject } from './AbstractObject'

export class Circle extends AbstractObject implements IObject {
  r: number = 0
  graphics: Graphics
  constructor(r: number) {
    super()
    this.r = r
    this.graphics = new Graphics()
  }

  init() {
    this.graphics.clear()
    this.graphics.beginFill(0x9966ff)
    this.graphics.drawCircle(0, 0, this.r)
    this.graphics.endFill()
    this.updateBoxFromRadius(this.r)
    return this
  }

  destructor() {
    this.graphics.destroy()
  }

  updateBoxFromRadius(r: number) {
    this.box[0][$x] = -r
    this.box[0][$y] = -r
    this.box[1][$x] = r
    this.box[1][$y] = r
  }
}
