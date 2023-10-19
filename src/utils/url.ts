export function getURLParam(key: string, defaultValue: string): string
export function getURLParam(
  key: string,
  defaultValue: string | null = null
): string | null {
  return (
    new URLSearchParams(new URL(window.location.href).search).get(key) ?? defaultValue
  )
}
