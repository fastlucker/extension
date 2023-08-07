import { useContext } from 'react'

import { StateContext } from '@web/contexts/stateContext'

export default function useAccountAdder() {
  const context = useContext(StateContext)

  if (!context) {
    throw new Error('useAccountAdder must be used within a StateProvider')
  }

  console.log('state.accountAdder', context.state.accountAdder)
  return {
    state: context.state.accountAdder
  }
}
