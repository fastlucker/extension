import orcWarrior from '../images/orc-warrior.png'
import penguinPaladin from '../images/penguin-paladin.png'
import shapeshifter from '../images/shapeshifter.png'
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
    name: 'The Degenerate',
    description: '',
    image: slimeCharacter
  },
  {
    id: 2,
    name: 'The Codeweaver',
    description: '',
    image: sorceressCharacter
  },
  {
    id: 3,
    name: 'The Layerbinder',
    description: '',
    image: vitalikCharacter
  },
  {
    id: 4,
    name: 'The Custodian',
    description: '',
    image: penguinPaladin
  },
  {
    id: 5,
    name: 'The Warrior',
    description: '',
    image: orcWarrior
  },
  {
    id: 6,
    name: 'The Shapeshifter',
    description: '',
    image: shapeshifter
  }
]
