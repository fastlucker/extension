import penguinPaladin from '../images/penguin-paladin.png'
import slimeCharacter from '../images/slime.png'
import sorceressCharacter from '../images/sorceress.png'
import vitalikCharacter from '../images/vitalik.png'

export type Character = {
  id: number
  name: string
  description: string
  image: string
}

export const CHARACTERS: Character[] = [
  {
    id: 1,
    name: 'Sorceress',
    description: '',
    image: sorceressCharacter
  },
  {
    id: 2,
    name: 'Necromancer Vitalik',
    description: '',
    image: vitalikCharacter
  },
  {
    id: 3,
    name: 'Slime',
    description: '',
    image: slimeCharacter
  },

  {
    id: 4,
    name: 'Penguin Paladin',
    description: '',
    image: penguinPaladin
  }
]
