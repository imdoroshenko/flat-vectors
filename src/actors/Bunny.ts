import { Sprite } from '@pixi/sprite'
import { AbstractActor, BodyType, IActor, ICollidable } from './AbstractActor'
import { Vector } from '../Vector'

export class Bunny extends AbstractActor implements IActor {
  graphics: Sprite
  width: number
  height: number
  bodyType: BodyType = 'rectangle'
  pivot: Vector = new Vector(0, 0)
  constructor(width: number = 26, height: number = 37) {
    super()
    this.graphics = Sprite.from('https://pixijs.com/assets/bunny.png')
    this.width = width
    this.height = height
  }
  init() {
    this.graphics.width = this.width
    this.graphics.height = this.height
    this.polygon.length = 0

    this.polygon.push(
      new Vector(-this.width / 2, -this.height / 2),
      new Vector(this.width / 2, -this.height / 2),
      new Vector(this.width / 2, this.height / 2),
      new Vector(-this.width / 2, this.height / 2)
    )
    this.pivot.set(this.width / 2, this.height / 2)
    this.graphics.anchor.set(0.5)
    return this
  }
  destructor(): void {}
}
