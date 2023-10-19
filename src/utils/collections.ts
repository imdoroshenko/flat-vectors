export function combine<T>(el: T[], cb: (a: [T, number], b: [T, number]) => void) {
  const ln = el.length
  for (let i = 0; i < ln; i++) {
    for (let j = i + 1; j < ln; j++) {
      cb([el[i], i], [el[j], j])
    }
  }
}
