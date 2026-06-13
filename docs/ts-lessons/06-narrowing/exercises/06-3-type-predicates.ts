function isNumber(value: unknown): value is string {
  return typeof value === 'string'
}

const xx: string | number = '43'

if (isNumber(xx)) {
  console.log(xx.toUpperCase())
}
