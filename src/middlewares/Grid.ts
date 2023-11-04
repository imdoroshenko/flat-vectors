import { IMiddleware, World } from '../World'
import { IActor } from '../actors/AbstractActor'
import { Container } from '@pixi/display'
import { Graphics } from '@pixi/graphics'

import { assert } from '../utils/assert'

class EventEmmiter<T extends { [k: string]: (...args: any[]) => any }> {
  listeners = new Map<keyof T, Set<T[keyof T]>>()
  on<K extends keyof T>(type: K, listener: T[K]) {
    this.listeners.set(type, (this.listeners.get(type) ?? new Set()).add(listener))
    return this
  }
  off<K extends keyof T>(type: K, listener: T[K]) {
    this.listeners.set(type, (this.listeners.get(type) ?? new Set()).add(listener))
    return this
  }
  trigger<K extends keyof T>(type: K, params: Parameters<T[K]>) {
    this.listeners.get(type)?.forEach((listener) => listener(...params))
    return this
  }
}

type GridEvents = {
  onHover: (tile: Tile) => void
  onSelected: (tile: number) => void
}

export class Tile {
  x: number
  y: number
  z: number
  constructor(x: number, y: number, z: number = 0) {
    this.x = x
    this.y = y
    this.z = z
  }
}

class TileMap {
  map: Tile[][][] = [[[]]]
  get(x: number, y: number, z: number): Tile {
    return this.map[z]?.[x]?.[y] ?? new Tile(x, y, z)
  }
}

export class GridManager implements IMiddleware {
  container: Container = new Container()
  infoContainer: Container = new Container()
  _highlightingGraphics: Graphics | null = null
  tileSize: number
  activeLevel: number = 0
  levelsNum: number = 1
  size: [number, number]
  levels: GridLevel[] = []
  _world: World | null = null
  emmiter = new EventEmmiter<GridEvents>()
  map: TileMap = new TileMap()
  hoverCoords: [number, number, number] = [0, 0, 0]

  constructor(size: [number, number] = [200, 200], tileSize: number = 25) {
    this.tileSize = tileSize
    this.size = size
  }
  tearUp() {
    for (let i = 0; i < this.levelsNum; i++) {
      const grid = new GridLevel(this.size, this.tileSize).createGrid()
      this.levels.push(grid)
      this.container.addChild(grid.container)
    }
    this.container.addChild(this.highlightingGraphics)
    this.world.app.stage.addChild(this.container)
    this.world.app.view.addEventListener('pointermove', this.pointerMoveHandler)
  }
  tearDown() {}

  hightlightCoords(x: number, y: number, z: number) {
    this.highlightingGraphics.clear()
    this.highlightingGraphics.beginFill(0xffffff, 0.2)
    this.highlightingGraphics.drawRect(
      x * this.tileSize,
      y * this.tileSize,
      this.tileSize,
      this.tileSize
    )
    this.highlightingGraphics.endFill()
  }

  get highlightingGraphics(): Graphics {
    if (!this._highlightingGraphics) {
      this._highlightingGraphics = new Graphics()
      this.infoContainer.addChild(this._highlightingGraphics)
    }
    return this._highlightingGraphics
  }

  pointerMoveHandler = (e: PointerEvent) => {
    const coords = [
      (e.x / this.tileSize) | 0,
      (e.y / this.tileSize) | 0,
      this.activeLevel,
    ] as [number, number, number]

    if (
      coords[0] === this.hoverCoords[0] &&
      coords[1] === this.hoverCoords[1] &&
      coords[2] === this.hoverCoords[2]
    ) {
      return
    }
    this.hoverCoords = coords
    this.emmiter.trigger('onHover', [this.map.get(...coords)])
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

export class GridLevel {
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
