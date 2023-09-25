import { $r, $x, $y, Box, Space } from '../types'
import { Vector } from '../Vector'
import { DisplayObject } from '@pixi/display'

export interface IObject {
  readonly space: Space
  readonly box: Box
  graphics: DisplayObject
  applySpace(): this
  destructor(): void
  init(): this
}

export abstract class AbstractObject {
  readonly space: Space = [new Vector(0, 0), new Vector(0, 0), new Vector(0, 0)]
  readonly box: Box = [new Vector(0, 0), new Vector(0, 0)]
  abstract graphics: DisplayObject
  applySpace(): this {
    this.graphics.x = this.space[$r][$x]
    this.graphics.y = this.space[$r][$y]
    return this
  }
}
