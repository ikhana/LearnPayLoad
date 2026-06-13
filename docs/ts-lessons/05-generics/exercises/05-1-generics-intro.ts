type Payload<T> = {
  name: string
  test: T
}

const payload: Payload<number> = {
  name: 'Inaam',
  test: 23,
}

const payload1: Payload<boolean> = {
  name: 'inaam',
  test: true,
}

const payload2: Payload<string> = {
  name: 'Inaam',
  test: 'Taking Interview ',
}

const payloadgenericwitharray: Payload<string[]> = {
  name: 'Inaam',
  test: ['inaam', 'taking test ', 'yes taking interview'],
}

const payloadgenericwithnumberarray: Payload<number[]> = {
  name: 'payload',
  test: [1, 3, 3, 3, 4],
}

const payloadwithbooleanaaraygeneric: Payload<boolean[]> = {
  name: 'Inaam',
  test: [true, false, false],
}
