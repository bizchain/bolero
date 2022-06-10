export function utils(): string {
  return 'utils'
}

export function isEmpty(value: any): boolean {
  if (value === undefined || value === null) return true
  if (typeof value === "string" && value.replaceAll(" ", "").length === 0) return true
  return false
}