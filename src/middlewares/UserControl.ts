import { Vector } from '../Vector'
import { IMiddleware } from '../World'
import { IActor } from '../actors/AbstractActor'
import { $o, $v, $w, $x, $y, Space } from '../types'

export class UserControl implements IMiddleware {
  actor: IActor | null
  isPressed: Set<string> = new Set()
  sideEffect: Space = [new Vector(0, 0), new Vector(0, 0), new Vector(0, 0), 0, 0]
  speed: number = 200
  constructor() {
    this.actor = null
    window.addEventListener('keydown', this.keyDownHandler)
    window.addEventListener('keyup', this.keyUpHandler)
  }

  addActors = () => {}
  setWorld = () => this
  tearDown = () => {
    window.removeEventListener('keydown', this.keyDownHandler)
    window.removeEventListener('keyup', this.keyUpHandler)
  }

  keyDownHandler = (e: KeyboardEvent) => {
    if (!this.actor || this.isPressed.has(e.code)) return
    console.log('keyDownHandler')
    this.isPressed.add(e.code)
    e.preventDefault()
  }

  keyUpHandler = (e: KeyboardEvent) => {
    if (!this.actor || !this.isPressed.has(e.code)) return
    console.log('keyUpHandler')
    this.isPressed.delete(e.code)
    e.preventDefault()
  }

  setControlledActor(actor: IActor) {
    this.actor = actor
    this.actor.sideEffects.add(this.sideEffect)
    return this
  }
  tick(delta: number): void {
    if (!this.actor) return
    this.sideEffect[$v].flush()
    this.sideEffect[$o] = 0
    let speed = this.speed
    if (this.isPressed.has('ShiftLeft')) {
      speed *= 5
    }
    if (this.isPressed.has('ArrowUp')) {
      this.sideEffect[$v][$y] = -1
    }
    if (this.isPressed.has('ArrowDown')) {
      this.sideEffect[$v][$y] = 1
    }
    if (this.isPressed.has('ArrowLeft')) {
      this.sideEffect[$o] = -1
    }
    if (this.isPressed.has('ArrowRight')) {
      this.sideEffect[$o] = 1
    }
    this.sideEffect[$v].rotate(this.actor.rotation).mul(speed)
  }
}
