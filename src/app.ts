import { Application } from '@pixi/app'
import { Circle } from './objects/Circle'
import { Motion } from './Motion'
import { $a, $r, $v, $x, $y } from './types'
import { Vector } from './Vector'
import { Bunny } from './objects/Bunny'

export function initApp(el: HTMLElement) {
  const app = new Application<HTMLCanvasElement>({ background: '#000', resizeTo: window })
  const timeFactor = 1e-3
  // @ts-ignore
  globalThis.__PIXI_APP__ = app
  el.appendChild(app.view)

  const motion = new Motion([new Vector(0, 0), new Vector(1000, 700)])
  const circle = new Bunny().init()
  circle.space[$v][$x] = 200
  circle.space[$v][$y] = 200
  circle.space[$a][$x] = -50
  circle.rotationFrequency = 0.5
  app.stage.addChild(circle.graphics)
  motion.objects.push(circle)
  // for (let i = 0; i < 1000; i++) {
  //   const circle = new Bunny().init()
  //   circle.space[$a][$x] = i + 1
  //   circle.space[$a][$y] = i + 1
  //   // circle.space[$v][$x] = 200 + i / 10
  //   // circle.space[$v][$y] = 200 + i / 10
  //   // circle.space[$a][$x] = -50
  //   app.stage.addChild(circle.graphics)
  //   motion.objects.push(circle)
  // }

  app.ticker.add(() => {
    const elapsed = app.ticker.elapsedMS * timeFactor
    motion.applyMotion(elapsed)
  })
}
