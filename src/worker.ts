// let objects = []

// self.onmessage = (event) => {
//   console.log(event.data)
//   const incoming = []
//   for (let i = 0; i < event.data.id.length; i++) {
//     incoming.push({
//       id: event.data.id[i],
//       position: [event.data.positions[i * 2], event.data.positions[i * 2 + 1]],
//       velocity: [event.data.velocity[i * 2], event.data.velocity[i * 2 + 1]],
//       mass: [event.data.mass[i * 2], event.data.mass[i * 2 + 1]],
//     })
//   }
//   objects = incoming
//   // console.log(incoming)
// }

// function tick(elapsed: number) {
//   console.log(elapsed)
// }

// ;(function () {
//   let last = performance.now()
//   ;(function loop() {
//     setTimeout(loop, 1000 / 64)
//     const now = performance.now()
//     const elapsed = now - last
//     last = now
//     tick(elapsed)
//   })()
// })()
