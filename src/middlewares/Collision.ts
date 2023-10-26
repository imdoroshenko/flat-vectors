import { Vector } from '../Vector'
import { IMiddleware, World } from '../World'
import { IActor, ICollidable, ITransformable } from '../actors/AbstractActor'
import { $r } from '../types'
import { combine } from '../utils/collections'
import { detect_collision, detect_collision_bulk } from 'sat_collision'

export type CollisionImplementation = 'js' | 'wasm' | 'wasm-bulk' | string

export class Collision implements IMiddleware {
  readonly objects: IActor[] = []

  tearDown = () => {}
  setWorld = () => this

  impl: CollisionImplementation = 'js'

  constructor(impl: CollisionImplementation = 'js') {
    this.impl = impl
  }

  addActors(...objects: any[]) {
    this.objects.push(...objects)
    return this
  }

  *getProjectionAxis(polygon: Vector[]) {
    for (let i = 0, ln = polygon.length; i < ln; i++) {
      const v1 = polygon[i]
      const v2 = polygon[(i + 1) % ln]
      yield v1.copy().sub(v2).normal()
    }
  }

  detectColisionSAT(p1: Vector[], p2: Vector[]) {
    for (const axis of this.getProjectionAxis([...p1, ...p2])) {
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

  resetCollisions() {
    this.objects.forEach((obj) => obj.targets.clear())
  }

  triggerRedraw() {
    this.objects.forEach((obj) => obj.init())
  }

  getTransformedPolygon(obj: ICollidable & ITransformable): Vector[] {
    return obj.polygon.map((v) =>
      v.copy().sub(obj.pivot).rotate(obj.rotation).add(obj.space[$r])
    )
  }

  getTransformedPolygonFlat(obj: ICollidable & ITransformable): number[] {
    return obj.polygon.flatMap((v) =>
      v.copy().sub(obj.pivot).rotate(obj.rotation).add(obj.space[$r])
    )
  }

  onlyPolygons() {
    return this.objects.filter((o) => o.bodyType === 'polygon')
  }

  transformPolygon(actor: IActor, memo: Map<ICollidable, Vector[]>): Vector[] {
    if (!memo.has(actor)) {
      memo.set(actor, this.getTransformedPolygon(actor))
    }
    return memo.get(actor)!
  }

  transformPolygonWASMPrepared(
    actor: IActor,
    memo: Map<ICollidable, Float32Array>
  ): Float32Array {
    if (!memo.has(actor)) {
      memo.set(actor, new Float32Array(this.getTransformedPolygonFlat(actor)))
    }
    return memo.get(actor)!
  }

  detectCollisionsJS() {
    // do SAT collision detection in JS
    const map = new Map<ICollidable, Vector[]>()
    combine(this.onlyPolygons(), ([obj1], [obj2]) => {
      if (
        this.detectColisionSAT(
          this.transformPolygon(obj1, map),
          this.transformPolygon(obj2, map)
        )
      ) {
        obj1.targets.add(obj2)
        obj2.targets.add(obj1)
      }
    })
  }

  detectCollisionsWASM() {
    // Send polygon pairs to WASM method for collision detection
    const map = new Map<ICollidable, Float32Array>()
    combine(this.onlyPolygons(), ([obj1], [obj2]) => {
      if (
        detect_collision(
          this.transformPolygonWASMPrepared(obj1, map),
          this.transformPolygonWASMPrepared(obj2, map)
        )
      ) {
        obj1.targets.add(obj2)
        obj2.targets.add(obj1)
      }
    })
  }

  detectCollisionsWASMBulk() {
    // Batch all polygons together and send it to WASM for collision detection
    const polys = this.onlyPolygons()

    const [polygons, sizes] = polys.reduce<[number[], number[]]>(
      (acc, obj) => {
        const flatPolygon = this.getTransformedPolygonFlat(obj)
        acc[0].push(...flatPolygon)
        acc[1].push(flatPolygon.length)
        return acc
      },
      [[], []]
    )
    // console.log(polygons, sizes)
    const result = detect_collision_bulk(
      new Float32Array(polygons),
      new Uint32Array(sizes)
    )
    for (let i = 1; i < result.length; i += 2) {
      const obj1 = polys[result[i - 1]]
      const obj2 = polys[result[i]]
      obj1.targets.add(obj2)
      obj2.targets.add(obj1)
    }
  }

  tick(delta: number): void {
    this.resetCollisions()
    console.time('collision')
    switch (this.impl) {
      case 'wasm':
        this.detectCollisionsWASM()
        break
      case 'wasm-bulk':
        this.detectCollisionsWASMBulk()
        break
      case 'js':
      default:
        this.detectCollisionsJS()
        break
    }
    console.timeEnd('collision')
    this.triggerRedraw()
  }
}
