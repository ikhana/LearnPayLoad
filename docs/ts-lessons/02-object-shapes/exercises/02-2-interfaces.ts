type DogType = {
  name: string
  breed: string
}

interface DogInterface {
  name: string
  breed: string
}

const dog: DogType = {
  name: 'Najo',
  breed: 'hushpuppy',
}

const dog1: DogInterface = {
  name: 'Najo',
  breed: 'normal',
}

type Color = 'Blue' | 'RED'
//interface ColorInteface =
