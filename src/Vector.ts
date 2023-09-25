import { $x, $y } from './types'

export class Vector extends Array<number> {
  /**
   * For performance sake all operations are done in place.
   * Use `copy()` to get a new vector.
   * @param v
   * @returns
   */
  add(v: Array<number>) {
    this[$x] += v[0]
    this[$y] += v[1]
    return this
  }
  sub(v: Array<number>) {
    this[$x] -= v[0]
    this[$y] -= v[1]
    return this
  }
  div(s: number) {
    this[$x] /= s
    this[$y] /= s
    return this
  }
  mul(s: number) {
    this[$x] *= s
    this[$y] *= s
    return this
  }
  neg() {
    this[$x] = -this[$x]
    this[$y] = -this[$y]
    return this
  }
  magnitude() {
    return Math.sqrt(this[$x] * this[$x] + this[$y] * this[$y])
  }
  nor() {
    const len = this.magnitude()
    this[$x] /= len
    this[$y] /= len
    return this
  }
  copy() {
    return new Vector(this[$x], this[$y])
  }

  flush() {
    this[$x] = 0
    this[$y] = 0
    return this
  }

  rotate(angle: number) {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const x = this[$x]
    const y = this[$y]
    this[$x] = x * cos - y * sin
    this[$y] = x * sin + y * cos
    return this
  }
}
