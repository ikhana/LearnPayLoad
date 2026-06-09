type Address = {
  city: string
  country: string
}

type Principle = {
  name: string
  age: number
}

type School = {
  name: string
  badgeNumber: number
  address: Address
  principle: Principle
}

const school: School = {
  name: 'Gov High School',
  badgeNumber: 2345,
  address: {
    city: 'Chaman',
    country: 'Pakistan',
  },
  principle: {
    name: 'Inaam',
    age: 33,
  },
}

const badSchoolNesting: School = {
  name: '',
  badgeNumber: 232,
  address: {
    city: '234',
    country: 'Pakistan',
  },
  principle: {
    name: 'Inaam',
    age: 28,
  },
}
