class Vector {
  x = 0
  y = 0
  add(v) {
    this.x += v.x
    this.y += v.y
  }
}

class Vector2 extends Array {
  add(v) {
    this[0] += v[0]
    this[1] += v[1]
  }
  sub(v) {
    this[0] -= v[0]
    this[1] -= v[1]
  }
  div(v) {
    this[0] /= v[0]
    this[1] /= v[1]
  }
  mul(v) {
    this[0] *= v[0]
    this[1] *= v[1]
  }
}

function benchmark(f) {
  let time = 5000
  let frame = 1000 / 60
  let start = Date.now()
  let c = 0
  while (Date.now() - start <= time) {
    f()
    c++
  }
  console.table(`${f.name}\t\t\t${c}\t\t${c / time / frame}`)
}

function create__mutate_vector_test(initial_vector) {
  return function mutate_vector_test() {
    initial_vector[0][0] += initial_vector[1][0]
    initial_vector[0][1] += initial_vector[1][1]
    initial_vector[1][0] += initial_vector[2][0]
    initial_vector[1][1] += initial_vector[2][1]
  }
}

function create__replace_vector_test(initial_vector) {
  return function rep_vector_test() {
    initial_vector[0] = [initial_vector[0][0] + initial_vector[1][0], initial_vector[0][1] + initial_vector[1][1]]
    initial_vector[1] = [initial_vector[1][0] + initial_vector[2][0], initial_vector[1][1] + initial_vector[2][1]]
  }
}

function create__mutate_object_test(initial_vector) {
  return function mutate_obj_vector_test() {
    initial_vector.r.x += initial_vector.v.x
    initial_vector.r.y += initial_vector.v.y
    initial_vector.v.x += initial_vector.a.x
    initial_vector.v.y += initial_vector.a.y
  }
}

function create__replace_object_test(initial_vector) {
  return function rep_obj_vector_test() {
    initial_vector.r = { x: initial_vector.r.x + initial_vector.v.x, y: initial_vector.r.y + initial_vector.v.y }
    initial_vector.v = { x: initial_vector.v.x + initial_vector.a.x, y: initial_vector.v.y + initial_vector.a.y }
  }
}

function class_object_test(initial_vector) {
  return function cls_vector_test() {
    initial_vector.r.add(initial_vector.v)
    initial_vector.v.add(initial_vector.a)
  }
}

benchmark(
  create__mutate_vector_test([
    [0, 0],
    [0, 0],
    [9.8, 2],
  ])
)

benchmark(
  create__mutate_object_test({
    r: { x: 0, y: 0 },
    v: { x: 0, y: 0 },
    a: { x: 9.8, y: 2 },
  })
)

benchmark(
  class_object_test({
    r: new Vector2(0, 0),
    v: new Vector2(0, 0),
    a: new Vector2(9.8, 2),
  })
)

benchmark(
  class_object_test({
    r: new Vector(0, 0),
    v: new Vector(0, 0),
    a: new Vector(9.8, 2),
  })
)

// benchmark(
//   create__replace_vector_test([
//     [0, 0],
//     [0, 0],
//     [9.8, 2],
//   ])
// )

// benchmark(
//   create__replace_object_test({
//     r: { x: 0, y: 0 },
//     v: { x: 0, y: 0 },
//     a: { x: 9.8, y: 2 },
//   })
// )
