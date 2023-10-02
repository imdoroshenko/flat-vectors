import { Vector } from '../Vector'
import { IMiddleware } from '../World'
import { IActor } from '../actors/AbstractActor'
import { $a, $o, $r, $v, Box } from '../types'

const { PI } = Math

export class Transform implements IMiddleware {
  readonly objects: IActor[] = []
  readonly container: Box = [new Vector(0, 0), new Vector(100, 100)]
  constructor(area: Box) {
    this.setArea(area)
  }

  setArea(area: Box) {
    for (const i in area) {
      this.container[i] = area[i]
    }
    return this
  }

  addActors(...objects: IActor[]) {
    this.objects.push(...objects)
    return this
  }

  tick(delta: number) {
    this.objects.forEach((obj) => {
      const newVelocity = obj.space[$v].copy()
      let rotationFrequency = 0
      obj.sideEffects.forEach((sideEffect) => {
        newVelocity.add(sideEffect[$v])
        rotationFrequency += sideEffect[$o]
      })
      obj.space[$r].add(newVelocity.copy().mul(delta))
      obj.space[$v].add(obj.space[$a].copy().mul(delta))
      obj.rotation += 2 * PI * rotationFrequency * delta
      obj.applySpace()
    })
  }
}
