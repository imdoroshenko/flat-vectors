import './style.css'
import { World } from './World'
import { Transform } from './middlewares/Motion'
import { Vector } from './Vector'
import { Bunny } from './actors/Bunny'
import { UserControl } from './middlewares/UserControl'
import init from '../wasm/build/release.wasm?init'
// import MyWorker from './worker?worker'

const api = await init({
  env: {
    abort(
      message: string | null,
      fileName: string | null,
      lineNumber: number,
      columnNumber: number
    ) {
      console.error(
        'abort called at main.ts',
        message,
        fileName,
        lineNumber,
        columnNumber
      )
    },
  },
}).then((instance) => {
  const e = instance.exports as any
  return e
})

// const worker = new MyWorker()

window.addEventListener('mousedown', (e) => {
  const objects = []
  const positions = []
  const velocity = []
  const mass = []
  for (let i = 0; i < 10000; i++) {
    objects.push(`id-${i}`)
    positions.push(i / 10, i / 10)
    velocity.push(0, 0)
    mass.push(0, 0)
  }
  // console.time('worker')
  const typedPositions = new Float32Array(positions)
  const typedVelocity = new Float32Array(velocity)
  const typedMass = new Float32Array(mass)
  console.log(api.add(typedPositions))
  // worker.postMessage(
  //   {
  //     id: objects,
  //     positions: typedPositions,
  //     velocity: typedVelocity,
  //     mass: typedMass,
  //   },
  //   [typedPositions.buffer, typedVelocity.buffer, typedMass.buffer]
  // )
  // JSON.stringify(objects)
  // console.timeEnd('worker')
})

const ctrl = new UserControl()
const world = new World({ el: document.querySelector<HTMLDivElement>('#app')! })
  .addMiddleware(new Transform([new Vector(0, 0), new Vector(1000, 700)]))
  .addMiddleware(ctrl)
  .init()
  .start()

const bunny = new Bunny().init()
ctrl.setControlledActor(bunny)
// bunny.space[$v][$x] = 200
// bunny.space[$v][$y] = 200
// bunny.space[$a][$x] = -50
// bunny.rotationFrequency = 0.5

world.addActors(bunny)
