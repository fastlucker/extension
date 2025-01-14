import React, { createContext, useEffect, useState } from 'react'
import { flushSync } from 'react-dom'

import { SignAccountOpController } from '@ambire-common/controllers/signAccountOp/signAccountOp'
import useDeepMemo from '@common/hooks/useDeepMemo'
import eventBus from '@web/extension-services/event/eventBus'

const SignAccountOpControllerStateContext = createContext<SignAccountOpController | null>(null)

const SignAccountOpControllerStateProvider: React.FC<any> = ({ children }) => {
  const [state, setState] = useState<SignAccountOpController | null>(null)

  useEffect(() => {
    const onUpdate = (newState: SignAccountOpController | null, forceEmit?: boolean) => {
      if (forceEmit) {
        flushSync(() => setState(newState))
      } else {
        setState(newState)
      }
    }

    eventBus.addEventListener('signAccountOp', onUpdate)

    return () => eventBus.removeEventListener('signAccountOp', onUpdate)
  }, [])

  const memoizedState = useDeepMemo(state, 'signAccountOp')

  return (
    <SignAccountOpControllerStateContext.Provider value={memoizedState}>
      {children}
    </SignAccountOpControllerStateContext.Provider>
  )
}

export { SignAccountOpControllerStateProvider, SignAccountOpControllerStateContext }
