import { Sprite } from '@pixi/sprite'
import { AbstractObject, IObject, IMobile, IRenderable } from './AbstractObject'

export class Bunny extends AbstractObject implements IObject {
  graphics: Sprite
  constructor() {
    super()
    this.graphics = Sprite.from('https://pixijs.com/assets/bunny.png')
  }
  init() {
    this.graphics.anchor.set(0.5)
    return this
  }
  destructor(): void {}
}
