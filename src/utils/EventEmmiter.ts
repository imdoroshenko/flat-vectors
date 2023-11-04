export class EventEmmiter<T extends { [k: string]: (...args: any[]) => any }> {
  listeners = new Map<keyof T, Set<T[keyof T]>>()
  on<K extends keyof T>(type: K, listener: T[K]) {
    this.listeners.set(type, (this.listeners.get(type) ?? new Set()).add(listener))
    return this
  }
  off<K extends keyof T>(type: K, listener: T[K]) {
    this.listeners.set(type, (this.listeners.get(type) ?? new Set()).add(listener))
    return this
  }
  trigger<K extends keyof T>(type: K, ...params: Parameters<T[K]>) {
    this.listeners.get(type)?.forEach((listener) => listener(...params))
    return this
  }
}
