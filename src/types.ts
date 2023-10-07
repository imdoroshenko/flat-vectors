import { Vector } from './Vector'

// location, velocity, acceleration, rotation, rotationFrequency
export type Space = [Vector, Vector, Vector, number, number]
// [[x0, y0], [x1, y1]]
export type Box = [Vector, Vector]
export type Dimension = Vector

// position
export const $r = 0 as const
// veolocity
export const $v = 1 as const
// acceleration
export const $a = 2 as const
// rotation
export const $t = 3 as const
// rotationFrequency
export const $o = 4 as const
// x
export const $x = 0 as const
// y
export const $y = 1 as const

export const $w = 0 as const
export const $h = 1 as const
