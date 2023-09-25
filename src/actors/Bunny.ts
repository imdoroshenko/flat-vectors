import { Sprite } from '@pixi/sprite'
import { AbstractActor, IActor } from './AbstractActor'

export class Bunny extends AbstractActor implements IActor {
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
