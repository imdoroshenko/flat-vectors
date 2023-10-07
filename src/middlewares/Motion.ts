import { Vector } from '../Vector'
import { IMiddleware, World } from '../World'
import { IActor } from '../actors/AbstractActor'
import { $a, $o, $r, $v, $x, $y, Box } from '../types'

const { max, min, PI } = Math

export class Transform implements IMiddleware {
  readonly objects: IActor[] = []
  readonly container: Box = [new Vector(0, 0), new Vector(100, 100)]
  constructor(area: Box) {
    this.setArea(area)
  }

  setWorld = () => this
  tearDown = () => {}

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
      // const [r, v, a] = obj.space
      // update location from speed
      // obj.space[$r][$x] = max(min(r[$x] + v[$x] * delta, rc1[$x]), rc0[$x])
      // obj.space[$r][$y] = max(min(r[$y] + v[$y] * delta, rc1[$y]), rc0[$y])
      // r.add(v.copy().mul(delta))
      // update speed from acceleration
      // v.add(a.copy().mul(delta))
      // obj.space[$v][$x] = v[$x] + a[$x] * delta
      // obj.space[$v][$y] = v[$y] + a[$y] * delta
      // update rotation

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
