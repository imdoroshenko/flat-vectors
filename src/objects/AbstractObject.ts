import { $r, $x, $y, Box, Space } from '../types'
import { Vector } from '../Vector'
import { DisplayObject } from '@pixi/display'

export interface IMobile {
  readonly space: Space
  rotation: number
  rotationFrequency: number
}

export interface IObject extends IMobile, IRenderable {
  readonly box: Box
  applySpace(): this
  destructor(): void
  init(): this
}

export interface IRenderable {
  graphics: DisplayObject
}

export abstract class AbstractObject {
  readonly space: Space = [new Vector(0, 0), new Vector(0, 0), new Vector(0, 0)]
  readonly box: Box = [new Vector(0, 0), new Vector(0, 0)]
  rotation: number = 0
  rotationFrequency: number = 0
  abstract graphics: DisplayObject
  applySpace(): this {
    this.graphics.x = this.space[$r][$x]
    this.graphics.y = this.space[$r][$y]
    this.graphics.rotation = this.rotation
    return this
  }
}
