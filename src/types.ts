import { Vector } from './Vector'

// location, velocity, acceleration, rotation, rotationFrequency
export type Space = [Vector, Vector, Vector, number, number]
// [[x0, y0], [x1, y1]]
export type Box = [Vector, Vector]
export type Dimension = Vector

export const $r = 0 as const
export const $v = 1 as const
export const $a = 2 as const
export const $t = 3 as const
export const $o = 4 as const
export const $x = 0 as const
export const $y = 1 as const

export const $w = 0 as const
export const $h = 1 as const
