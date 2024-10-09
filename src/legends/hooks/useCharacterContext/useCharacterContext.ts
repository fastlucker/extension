import { useContext } from 'react'

import { CharacterContext } from '@legends/contexts/characterContext'

export default function useCharacterContext() {
  const context = useContext(CharacterContext)

  if (!context) {
    throw new Error('useCharacterContext must be used within a CharacterContext')
  }

  return context
}
