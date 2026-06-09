type Profile = {
  username: string
  bio?: string | null
  age?: number
}

const inaamprofile: Profile = {
  username: 'Inaam',
}

const inaamprofile1: Profile = {
  username: 'Inaam2',
  age: 22,
}

const bioText = inaamprofile.bio
const len = inaamprofile.bio?.length
const upper = inaamprofile1.bio?.toUpperCase()
