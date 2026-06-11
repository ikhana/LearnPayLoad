type Season = 'sping' | 'summer' | 'fall' | 'winter'

function season(s: Season): string {
  return `it is a ${s}`
}

//season ('nofall') will be red squiggle

season('fall') // will return fall

type Resul = string | number | null

let r: Resul = 'pass'
r = 43
r = null
//  r = true  this will be a red squiggle

type Direction = 'north' | 'south' | 'east' | 'west'

function direct(direction: Direction): string {
  return `it is direction ${direction}`
}

// will be a red squiggle if say direct(up)
// but not when
direct('east')
