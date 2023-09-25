import { Vector } from './Vector'
import { IObject } from './objects/AbstractObject'
import { $r, $v, $x, $y, Box } from './types'

const { max, min } = Math

export class Motion {
  readonly objects: IObject[] = []
  readonly container: Box = [new Vector(0, 0), new Vector(100, 100)]
  constructor(area: Box) {
    this.setArea(area)
  }

  setArea(area: Box) {
    for (const i in area) {
      this.container[i] = area[i]
    }
  }

  applyMotion(delta: number) {
    const [rc0, rc1] = this.container
    this.objects.forEach((obj) => {
      const [r, v, a] = obj.space
      // update location from speed
      obj.space[$r][$x] = max(min(r[$x] + v[$x] * delta, rc1[$x]), rc0[$x])
      obj.space[$r][$y] = max(min(r[$y] + v[$y] * delta, rc1[$y]), rc0[$y])
      // update speed from acceleration
      v.add(a.copy().mul(delta))
      // obj.space[$v][$x] = v[$x] + a[$x] * delta
      // obj.space[$v][$y] = v[$y] + a[$y] * delta
      obj.applySpace()
    })
  }
}
