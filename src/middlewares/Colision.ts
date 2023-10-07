import { Vector } from '../Vector'
import { IMiddleware, World } from '../World'
import { IActor, ICollidable, ITransformable } from '../actors/AbstractActor'
import { $r } from '../types'
import { combine } from '../utils/collections'

export class Colision implements IMiddleware {
  readonly objects: IActor[] = []

  tearDown = () => {}
  setWorld = () => this

  addActors(...objects: any[]) {
    this.objects.push(...objects)
    return this
  }

  *getProjectionAxis(polygon: Vector[]) {
    for (let i = 0, ln = polygon.length; i < ln; i++) {
      const v1 = polygon[i]
      const v2 = polygon[(i + 1) % ln]
      yield v1
        .copy()
        .sub(v2)
        .rotate(Math.PI / 2)
        .nor()
    }
  }

  detectColisionSAT(p1: Vector[], p2: Vector[]) {
    for (const axis of this.getProjectionAxis(p1)) {
      const p1Projections = p1.map((v) => v.dot(axis))
      const p2Projections = p2.map((v) => v.dot(axis))
      const [p1min, p1max] = [Math.min(...p1Projections), Math.max(...p1Projections)]
      const [p2min, p2max] = [Math.min(...p2Projections), Math.max(...p2Projections)]
      if (p1max < p2min || p2max < p1min) {
        return false
      }
    }

    // const axes = [...p1, ...p2].map((v, i, arr) => {
    //   const next = arr[(i + 1) % arr.length]
    //   return next
    //     .copy()
    //     .sub(v)
    //     .rotate(Math.PI / 2)
    //     .nor()
    // })

    // const p1Projections = axes.map((axis) => {
    //   const projections = p1.map((v) => v.dot(axis))
    //   return [Math.min(...projections), Math.max(...projections)]
    // })
    // const p2Projections = axes.map((axis) => {
    //   const projections = p2.map((v) => v.dot(axis))
    //   return [Math.min(...projections), Math.max(...projections)]
    // })
    // const [p1Projections, p2Projections] = axes.reduce<[number[][], number[][]]>(
    //   ([a, b], axis) => {
    //     const p1Projections = p1.map((v) => v.dot(axis))
    //     const p2Projections = p2.map((v) => v.dot(axis))
    //     a.push([Math.min(...p1Projections), Math.max(...p1Projections)])
    //     b.push([Math.min(...p2Projections), Math.max(...p2Projections)])
    //     return [a, b]
    //   },
    //   [[], []] as [Vector[], Vector[]]
    // )

    // for (let i = 0; i < axes.length; i++) {
    //   const [p1min, p1max] = p1Projections[i]
    //   const [p2min, p2max] = p2Projections[i]
    //   if (p1max < p2min || p2max < p1min) {
    //     return false
    //   }
    // }
    return true
  }

  getTransformedPolygon(obj: ICollidable & ITransformable) {
    return obj.polygon.map((v) =>
      v.copy().sub(obj.pivot).rotate(obj.rotation).add(obj.space[$r])
    )
  }

  tick(delta: number): void {
    // console.time('colision')
    const map = new Map<ICollidable, Vector[]>()
    combine(this.objects, (obj1, obj2) => {
      if (obj1.bodyType === 'polygon' && obj2.bodyType === 'polygon') {
        if (!map.has(obj1)) {
          map.set(obj1, this.getTransformedPolygon(obj1))
        }
        if (!map.has(obj2)) {
          map.set(obj2, this.getTransformedPolygon(obj2))
        }
        const p1 = map.get(obj1)!
        const p2 = map.get(obj2)!
        if (this.detectColisionSAT(p1, p2)) {
          console.log('colision')
        }
      }
    })
    // console.timeEnd('colision')
  }
}
