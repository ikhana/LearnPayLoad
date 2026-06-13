function shout(value: number | string) {
  if (typeof value === 'string') {
    return value.toUpperCase()
  }
}

type User = {
  id: number
  name: string
}

function shout1(value: number | User) {
  if (typeof value === 'object') {
    return value.name
  }
}

type Category1 = {
  name: string
  id: number
}

function getCategory(value: number | Category1) {
  if (typeof value === 'object') {
    value.name.toUpperCase()
  }
}
