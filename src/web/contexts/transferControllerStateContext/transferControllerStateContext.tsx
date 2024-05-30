import React, { createContext, useEffect, useMemo } from 'react'

import humanizerInfo from '@ambire-common/consts/humanizer/humanizerInfo.json'
import { TransferController } from '@ambire-common/controllers/transfer/transfer'
import { HumanizerMeta } from '@ambire-common/libs/humanizer/interfaces'
import useRoute from '@common/hooks/useRoute'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useControllerState from '@web/hooks/useControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'

type ContextReturn = {
  state: TransferController
}

const TransferControllerStateContext = createContext<ContextReturn>({} as ContextReturn)

export const getInfoFromSearch = (search: string | undefined) => {
  if (!search || !search?.includes('networkId') || !search?.includes('address')) return null

  const params = new URLSearchParams(search)

  return {
    addr: params.get('address'),
    networkId: params.get('networkId'),
    isTopUp: typeof params.get('isTopUp') === 'string'
  }
}

const TransferControllerStateProvider: React.FC<any> = ({ children }) => {
  const state = useControllerState('transfer')
  const { dispatch } = useBackgroundService()
  const mainState = useMainControllerState()
  const { search } = useRoute()

  const selectedTokenFromUrl = useMemo(() => getInfoFromSearch(search), [search])

  useEffect(() => {
    return () => {
      dispatch({
        type: 'MAIN_CONTROLLER_TRANSFER_RESET_FORM'
      })
    }
  }, [dispatch])

  useEffect(() => {
    dispatch({
      type: 'MAIN_CONTROLLER_TRANSFER_UPDATE',
      params: {
        humanizerInfo: humanizerInfo as HumanizerMeta
      }
    })
  }, [dispatch])

  useEffect(() => {
    dispatch({
      type: 'MAIN_CONTROLLER_TRANSFER_UPDATE',
      params: { isTopUp: !!selectedTokenFromUrl?.isTopUp }
    })
  }, [selectedTokenFromUrl?.isTopUp, dispatch])

  useEffect(() => {
    if (mainState.isReady && !Object.keys(state).length) {
      dispatch({
        type: 'INIT_CONTROLLER_STATE',
        params: { controller: 'transfer' }
      })
    }
  }, [dispatch, mainState.isReady, state])

  return (
    <TransferControllerStateContext.Provider value={useMemo(() => ({ state }), [state])}>
      {children}
    </TransferControllerStateContext.Provider>
  )
}

export { TransferControllerStateProvider, TransferControllerStateContext }
