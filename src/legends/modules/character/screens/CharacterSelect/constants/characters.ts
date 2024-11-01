import orcWarrior from '../images/orcWarrior.png'
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
    name: 'Slime',
    description: '',
    image: slimeCharacter
  },
  {
    id: 2,
    name: 'Sorceress',
    description: '',
    image: sorceressCharacter
  },
  {
    id: 3,
    name: 'Necromancer Vitalik',
    description: '',
    image: vitalikCharacter
  },
  {
    id: 4,
    name: 'Penguin Paladin',
    description: '',
    image: penguinPaladin
  },
  {
    id: 5,
    name: 'Orc Warrior?',
    description: '',
    image: orcWarrior
  }
]
