export function combine<T>(el: T[], cb: (a: T, b: T) => void) {
  for (let i = 0; i < el.length; i++) {
    for (let j = i + 1; j < el.length; j++) {
      cb(el[i], el[j])
    }
  }
}
