import { useContext } from 'react'

import { KeyboardContext } from '@common/contexts/keyboardContext'

export default function useKeyboard() {
  const context = useContext(KeyboardContext)

  if (!context) {
    throw new Error('useKeyboard must be used within an KeyboardProvider')
  }

  return context
}
