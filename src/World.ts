import { Application } from '@pixi/app'
import { Box } from './types'
import { Vector } from './Vector'
import { IActor } from './actors/AbstractActor'
import { EventEmmiter } from './utils/EventEmmiter'
export interface IMiddleware {
  setWorld: (world: World) => this
  tick: (delta: number) => void
  addActors: (...objects: IActor[]) => void
  tearDown: () => void
  tearUp: () => void
}

export interface Params {
  el: HTMLElement
}

export type WorldKeyEvent = {
  world: World
  keyCode: string
}

export type WorldPointerEvent = {
  world: World
  x: number
  y: number
}

type WorldEvents = {
  pointerMove: (e: WorldPointerEvent) => void
  keyPressed: (e: WorldKeyEvent) => void
  keyReleased: (e: WorldKeyEvent) => void
}

export class World {
  app: Application<HTMLCanvasElement>
  container: Box = [new Vector(0, 0), new Vector(100, 100)]
  actors: IActor[] = []
  middlewares: IMiddleware[] = []
  timeFactor: number = 1e-3
  el: HTMLElement
  isPressed: Set<string> = new Set()
  event = new EventEmmiter<WorldEvents>()
  constructor({ el }: Params) {
    this.app = new Application<HTMLCanvasElement>({
      background: '#000',
      resizeTo: el,
    })

    this.el = el
    // @ts-ignore
    globalThis.__PIXI_APP__ = app
  }
  init() {
    this.el.appendChild(this.app.view)
    window.addEventListener('keydown', this.keyDownHandler)
    window.addEventListener('keyup', this.keyUpHandler)
    this.el.addEventListener('pointermove', this.pointerMoveHandler)
    return this
  }

  keyDownHandler = (e: KeyboardEvent) => {
    if (this.isPressed.has(e.code)) {
      return
    }
    this.event.trigger('keyPressed', { world: this, keyCode: e.code })
    this.isPressed.add(e.code)
    e.preventDefault()
  }

  keyUpHandler = (e: KeyboardEvent) => {
    if (!this.isPressed.has(e.code)) {
      return
    }
    this.event.trigger('keyReleased', { world: this, keyCode: e.code })
    this.isPressed.delete(e.code)
    e.preventDefault()
  }

  pointerMoveHandler = (e: PointerEvent) => {
    this.event.trigger('pointerMove', { world: this, x: e.x, y: e.y })
  }

  addMiddleware(middleware: IMiddleware) {
    middleware.setWorld(this)
    middleware.tearUp()
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
