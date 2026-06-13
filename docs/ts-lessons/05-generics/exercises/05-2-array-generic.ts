const ab: Array<boolean> = [true, false]
const ba: boolean[] = [true, false]

// generic can take more than one parameters
type Generics<A, B, C> = {
  name: A
  test: B
  called: C
}

const generics: Generics<number, string, boolean> = {
  name: 123,
  test: 'taken',
  called: true,
}

// array of custom type  already done above but here is the example

type Gates = { id: number; catalogue: string }

const gates: Array<Gates> = [{ id: 123, catalogue: 'inaam' }]
