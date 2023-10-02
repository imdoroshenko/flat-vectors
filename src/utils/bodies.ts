import { ICollidable } from '../actors/AbstractActor'
import { $x, $y } from '../types'

export function cHeight(body: ICollidable) {
  switch (body.bodyType) {
    case 'circle':
      return body.radius * 2
    case 'rectangle':
    case 'polygon':
      return body.polygon.reduce((max, v) => Math.max(max, v[$y]), 0)
  }
}

export function cWidth(body: ICollidable) {
  switch (body.bodyType) {
    case 'circle':
      return body.radius * 2
    case 'rectangle':
    case 'polygon':
      return body.polygon.reduce((max, v) => Math.max(max, v[$x]), 0)
  }
}
