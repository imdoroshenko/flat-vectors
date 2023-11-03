import { IMiddleware, World } from '../World'
import { IActor } from '../actors/AbstractActor'
import { Container } from '@pixi/display'
import { Graphics } from '@pixi/graphics'

import { assert } from '../utils/assert'

export class GridManager implements IMiddleware {
  container: Container
  tileSize: number
  activeLevel: number = 0
  levelsNum: number = 1
  size: [number, number]
  levels: Grid[] = []
  _world: World | null = null
  constructor(size: [number, number] = [200, 200], tileSize: number = 25) {
    this.container = new Container()
    this.tileSize = tileSize
    this.size = size
  }
  tearUp() {
    for (let i = 0; i < this.levelsNum; i++) {
      const grid = new Grid(this.size, this.tileSize).createGrid()
      this.levels.push(grid)
      this.container.addChild(grid.container)
    }
    this.world.app.stage.addChild(this.container)
    this.world.app.view.addEventListener('pointermove', this.pointerMoveHandler)
  }
  tearDown() {}

  pointerMoveHandler = (e: PointerEvent) => {
    console.log('pointerMoveHandler', e)
  }

  get world(): World {
    assert(!!this._world)
    return this._world
  }

  setWorld(world: World) {
    this._world = world
    return this
  }
  addActors(...objects: IActor[]) {
    return this
  }
  tick(delta: number): void {}
}

export class Grid {
  container: Container
  tileSize: number
  graphics: Graphics
  size: [number, number]
  constructor(size: [number, number] = [200, 200], tileSize: number = 50) {
    this.container = new Container()
    this.tileSize = tileSize
    this.graphics = new Graphics()
    this.size = size
    this.container.addChild(this.graphics)
    this.container.addListener('', (e) => {})
  }
  createGrid() {
    this.graphics.clear()
    this.graphics.lineStyle(1, 0xffffff, 0.1)
    const [width, height] = this.size
    for (let i = 0, x = 0; i < width; i++, x += this.tileSize) {
      this.graphics.moveTo(x, 0)
      this.graphics.lineTo(x, height * this.tileSize)
    }
    for (let i = 0, y = 0; i < height; i++, y += this.tileSize) {
      this.graphics.moveTo(0, y)
      this.graphics.lineTo(width * this.tileSize, y)
    }
    return this
  }
}
