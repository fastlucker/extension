/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useEffect, useMemo, useReducer, useState } from 'react'

import { stateContextDefaults, StateContextReturnType } from '@web/contexts/stateContext/types'
import eventBus from '@web/extension-services/event/eventBus'
import useBackgroundService from '@web/hooks/useBackgroundService'

const controllersInitialState = {
  main: {},
  accountAdder: {},
  portfolio: {}
}

const controllersReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_ALL':
      return { ...action.payload }
    case 'UPDATE_MAIN':
      return { ...state, main: action.payload }
    case 'UPDATE_ACCOUNT_ADDER':
      return { ...state, accountAdder: action.payload }
    case 'UPDATE_PORTFOLIO':
      return { ...state, portfolio: action.payload }
    default:
      return state
  }
}

const StateContext = createContext<StateContextReturnType>(stateContextDefaults)

const StateProvider: React.FC<any> = ({ children }) => {
  const [state, stateDispatch] = useReducer(controllersReducer, controllersInitialState)
  const [isReady, setIsReady] = useState(false)
  const { dispatchAsync } = useBackgroundService()

  console.log('state', state)
  useEffect(() => {
    const getControllersState = async () => {
      const controllersState = await dispatchAsync({ type: 'GET_CONTROLLERS_STATE' })
      console.log('GET_CONTROLLERS_STATE', controllersState)
      return stateDispatch({ type: 'UPDATE_ALL', payload: controllersState })
    }

    ;(async () => {
      await getControllersState()
      setIsReady(true)
    })()
  }, [])

  useEffect(() => {
    const onUpdate = (newState) => {
      stateDispatch({ type: 'UPDATE_ACCOUNT_ADDER', payload: newState })
      console.log('newState', newState)
    }

    eventBus.addEventListener('accountAdder', onUpdate)

    return () => eventBus.removeEventListener('accountAdder', onUpdate)
  }, [])

  return (
    <StateContext.Provider
      value={useMemo(
        () => ({
          state,
          isReady
        }),
        [state, isReady]
      )}
    >
      {children}
    </StateContext.Provider>
  )
}

export { StateProvider, StateContext }
