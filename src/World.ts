import { Application } from '@pixi/app'
import { Box } from './types'
import { Vector } from './Vector'
import { IActor } from './actors/AbstractActor'

export interface IMiddleware {
  setWorld?: (world: World) => this
  tick: (delta: number) => void
  addActors?: (...objects: IActor[]) => void
  tearDown?: () => void
}

export interface Params {
  el: HTMLElement
}

export class World {
  app: Application<HTMLCanvasElement>
  container: Box = [new Vector(0, 0), new Vector(100, 100)]
  actors: IActor[] = []
  middlewares: IMiddleware[] = []
  timeFactor: number = 1e-3
  el: HTMLElement
  constructor({ el }: Params) {
    this.app = new Application<HTMLCanvasElement>({
      background: '#000',
      resizeTo: window,
    })
    this.el = el
    // @ts-ignore
    globalThis.__PIXI_APP__ = app
  }
  init() {
    this.el.appendChild(this.app.view)
    return this
  }
  addMiddleware(middleware: IMiddleware) {
    middleware.setWorld && middleware.setWorld(this)
    this.middlewares.push(middleware)
    return this
  }
  addActors(...objects: IActor[]) {
    this.actors.push(...objects)
    this.app.stage.addChild(...objects.map((obj) => obj.graphics))
    for (const mw of this.middlewares) {
      mw.addActors && mw.addActors(...objects)
    }
    return this
  }
  start() {
    this.app.ticker.add(() => {
      const elapsed = this.app.ticker.elapsedMS * this.timeFactor
      this.middlewares.forEach((middleware) => middleware.tick(elapsed))
    })
    return this
  }
}
