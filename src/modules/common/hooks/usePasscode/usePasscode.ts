import { useContext } from 'react'

import { PasscodeContext } from '@modules/common/contexts/passcodeContext'

export default function usePasscode() {
  const context = useContext(PasscodeContext)

  if (!context) {
    throw new Error('usePasscode must be used within an PasscodeProvider')
  }

  return context
}
