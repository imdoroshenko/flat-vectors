import { Vector } from '../Vector'
import { $x, $y } from '../types'

export function project(v1: Vector, v2: Vector) {
  return dot(v1, v2) / lenSq(v2)
}

export function reflect(v1: Vector, v2: Vector) {
  const dot = v1[$x] * v2[$x] + v1[$y] * v2[$y]
  return new Vector(v1[$x] - 2 * dot * v2[$x], v1[$y] - 2 * dot * v2[$y])
}

export function clamp(v: Vector, min: number, max: number) {
  return new Vector(
    Math.max(min, Math.min(max, v[$x])),
    Math.max(min, Math.min(max, v[$y]))
  )
}

export function lenSq(v: Vector) {
  return v[$x] * v[$x] + v[$y] * v[$y]
}

export function dot(v1: Vector, v2: Vector) {
  return v1[$x] * v2[$x] + v1[$y] * v2[$y]
}
