/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useEffect, useMemo } from 'react'

import { AssetInfoController } from '@ambire-common/controllers/assetInfo/assetInfo'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useControllerState from '@web/hooks/useControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'

const AssetInfoControllerStateContext = createContext<AssetInfoController>(
  {} as AssetInfoController
)

const AssetInfoControllerStateProvider: React.FC<any> = ({ children }) => {
  const controller = 'assetInfo'
  const state = useControllerState(controller)
  const { dispatch } = useBackgroundService()
  const mainState = useMainControllerState()

  useEffect(() => {
    if (mainState.isReady && !Object.keys(state).length) {
      dispatch({
        type: 'INIT_CONTROLLER_STATE',
        params: { controller }
      })
    }
  }, [dispatch, mainState.isReady, state])

  return (
    <AssetInfoControllerStateContext.Provider value={useMemo(() => state, [state])}>
      {children}
    </AssetInfoControllerStateContext.Provider>
  )
}

export { AssetInfoControllerStateProvider, AssetInfoControllerStateContext }
