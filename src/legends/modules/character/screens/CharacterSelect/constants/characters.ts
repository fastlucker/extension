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
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    image: slimeCharacter
  },
  {
    id: 2,
    name: 'Sorceress',
    description: 'Morbi id nisl fringilla, aliquet elit sit amet.',
    image: sorceressCharacter
  },
  {
    id: 3,
    name: 'Necromancer Vitalik',
    description: 'Vestibulum condimentum aliquet tortor, eu laoreet magna.',
    image: vitalikCharacter
  },
  {
    id: 4,
    name: 'Penguin Paladin',
    description: 'Vestibulum condimentum aliquet tortor, eu laoreet magna.',
    image: penguinPaladin
  }
]
