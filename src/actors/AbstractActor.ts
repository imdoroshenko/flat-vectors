import { $r, $x, $y, Box, Space } from '../types'
import { Vector } from '../Vector'
import { DisplayObject } from '@pixi/display'

export interface ITransformable {
  readonly space: Space
  readonly sideEffects: Set<Space>
  rotation: number
  rotationFrequency: number
}

export type BodyType = 'circle' | 'rectangle' | 'polygon'

export interface IActor extends ITransformable, IRenderable, ICollidable {
  applySpace(): this
  destructor(): void
  init(): this
}

export interface IRenderable {
  graphics: DisplayObject
}

export interface ICollidable {
  bodyType: BodyType
  polygon: Vector[]
  radius: number
  pivot: Vector
  targets: Set<ICollidable>
}

export abstract class AbstractActor {
  targets: Set<ICollidable> = new Set()
  readonly space: Space = [new Vector(0, 0), new Vector(0, 0), new Vector(0, 0), 0, 0]
  readonly sideEffects: Set<Space> = new Set()
  readonly box: Box = [new Vector(0, 0), new Vector(0, 0)]
  rotation: number = 0
  rotationFrequency: number = 0
  abstract graphics: DisplayObject
  radius: number = 0
  readonly polygon: Vector[] = []
  applySpace(): this {
    this.graphics.x = this.space[$r][$x]
    this.graphics.y = this.space[$r][$y]
    this.graphics.rotation = this.rotation
    return this
  }
}
